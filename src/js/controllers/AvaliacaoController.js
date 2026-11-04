import { iniciarPagina } from './pagina.js';
import { PedidoService } from '../services/PedidoService.js';
import { ClienteService } from '../services/ClienteService.js';
import { AgenteService } from '../services/AgenteService.js';
import { AutomovelService } from '../services/AutomovelService.js';
import { ContratoService } from '../services/ContratoService.js';
import { Pedido } from '../models/Pedido.js';
import { TipoContrato } from '../models/Contrato.js';
import { AvaliacaoView } from '../views/AvaliacaoView.js';
import { PedidoView } from '../views/PedidoView.js';
import { opcoesProprietario, chaveProprietario } from '../views/AutomovelView.js';
import { mostrarAlerta } from '../views/componentes.js';

const usuario = iniciarPagina({ tiposPermitidos: ['EMPRESA', 'BANCO'] });

const tabelaPedidos = document.getElementById('tabelaPedidos');
const tabelaContratos = document.getElementById('tabelaContratos');
const filtroStatus = document.getElementById('filtroStatus');
const formEditar = document.getElementById('formEditar');
const formAvaliar = document.getElementById('formAvaliar');
const formContrato = document.getElementById('formContrato');
const modal = (id) => bootstrap.Modal.getOrCreateInstance(document.getElementById(id));

let pedidos = [];
let clientes = [];
let agentes = [];
let automoveis = [];

function renderizarPedidos() {
  const status = filtroStatus.value;
  const filtrados = status ? pedidos.filter((p) => p.status === status) : pedidos;
  AvaliacaoView.renderizarPedidos(tabelaPedidos, filtrados, clientes, automoveis);
}

async function carregar() {
  let contratos;
  [pedidos, clientes, agentes, automoveis, contratos] = await Promise.all([
    PedidoService.listar(),
    ClienteService.listar(),
    AgenteService.listar(),
    AutomovelService.listar(),
    ContratoService.listar(),
  ]);
  pedidos.sort((a, b) => b.id - a.id);
  renderizarPedidos();
  AvaliacaoView.renderizarContratos(tabelaContratos, contratos, clientes, agentes);
}

const buscarPedido = (id) => pedidos.find((p) => p.id === id);
const buscarCliente = (id) => clientes.find((c) => c.id === id);

function abrirEdicao(pedido) {
  formEditar.elements.automovelId.innerHTML = PedidoView.opcoesAutomoveis(automoveis);
  PedidoView.preencherFormulario(formEditar, pedido);
  modal('modalEditar').show();
}

function abrirAvaliacao(pedido) {
  formAvaliar.elements.id.value = pedido.id;
  formAvaliar.elements.parecer.value = '';
  document.getElementById('resumoAvaliacao').innerHTML =
    AvaliacaoView.resumoPedido(pedido, buscarCliente(pedido.clienteId), automoveis);
  modal('modalAvaliar').show();
}

function alternarCamposCredito() {
  const ehCredito = formContrato.elements.tipo.value === TipoContrato.CREDITO;
  document.getElementById('camposCredito').classList.toggle('d-none', !ehCredito);
  const pedido = buscarPedido(Number(formContrato.elements.pedidoId.value));
  formContrato.elements.proprietario.value = ehCredito
    ? chaveProprietario('AGENTE', usuario.id)
    : chaveProprietario('CLIENTE', pedido.clienteId);
}

function abrirContrato(pedido) {
  formContrato.reset();
  formContrato.elements.pedidoId.value = pedido.id;
  formContrato.elements.proprietario.innerHTML = opcoesProprietario(
    clientes.filter((c) => c.id === pedido.clienteId),
    agentes,
  );

  const ehBanco = usuario.tipo === 'BANCO';
  formContrato.elements.tipo.querySelector('[value=CREDITO]').disabled = !ehBanco;
  document.getElementById('avisoCredito').classList.toggle('d-none', ehBanco);
  formContrato.elements.bancoId.value = ehBanco ? usuario.id : '';
  document.getElementById('nomeBanco').textContent = usuario.nome;

  alternarCamposCredito();
  modal('modalContrato').show();
}

document.querySelectorAll('.modal').forEach((m) => {
  m.addEventListener('show.bs.modal', () => (m.querySelector('.alertas-modal').innerHTML = ''));
});

filtroStatus.addEventListener('change', renderizarPedidos);
formContrato.elements.tipo.addEventListener('change', alternarCamposCredito);

tabelaPedidos.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const pedido = buscarPedido(Number(botao.dataset.id));

  if (botao.dataset.acao === 'editar') abrirEdicao(pedido);
  else if (botao.dataset.acao === 'avaliar') abrirAvaliacao(pedido);
  else if (botao.dataset.acao === 'contrato') abrirContrato(pedido);
});

formEditar.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const dados = PedidoView.lerFormulario(formEditar);
    const atual = buscarPedido(Number(dados.id));
    if (!atual.podeSerModificadoPeloAgente()) throw new Error('Este pedido não pode mais ser modificado.');
    await PedidoService.salvar(new Pedido({ ...atual, ...dados }));
    modal('modalEditar').hide();
    mostrarAlerta(`Pedido #${dados.id} modificado com sucesso!`);
    carregar();
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger', 'alertasEditar');
  }
});

formAvaliar.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const aprovado = evento.submitter.value === 'aprovar';
  const { id, parecer } = Object.fromEntries(new FormData(formAvaliar));
  try {
    if (!parecer.trim()) throw new Error('Escreva o parecer financeiro.');
    await PedidoService.avaliar(Number(id), usuario.id, aprovado, parecer);
    modal('modalAvaliar').hide();
    mostrarAlerta(`Pedido #${id} ${aprovado ? 'aprovado' : 'reprovado'}.`, aprovado ? 'success' : 'warning');
    carregar();
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger', 'alertasAvaliar');
  }
});

formContrato.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(formContrato));
  const [proprietarioTipo, proprietarioId] = dados.proprietario.split(':');
  try {
    await ContratoService.executar({
      pedidoId: dados.pedidoId,
      tipo: dados.tipo,
      proprietarioTipo,
      proprietarioId,
      credito: { bancoId: dados.bancoId || null, valor: dados.valor, parcelas: dados.parcelas },
    });
    modal('modalContrato').hide();
    mostrarAlerta(`Contrato do pedido #${dados.pedidoId} executado com sucesso!`);
    carregar();
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger', 'alertasContrato');
  }
});

if (usuario) carregar().catch((erro) => mostrarAlerta(erro.message, 'danger'));
