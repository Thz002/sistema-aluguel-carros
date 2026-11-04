import { iniciarPagina } from './pagina.js';
import { PedidoService } from '../services/PedidoService.js';
import { AutomovelService } from '../services/AutomovelService.js';
import { ContratoService } from '../services/ContratoService.js';
import { Pedido } from '../models/Pedido.js';
import { hojeISO } from '../models/datas.js';
import { PedidoView } from '../views/PedidoView.js';
import { mostrarAlerta } from '../views/componentes.js';

const usuario = iniciarPagina({ tiposPermitidos: ['CLIENTE'] });

const form = document.getElementById('formPedido');
const tabela = document.getElementById('tabelaPedidos');
let automoveis = [];

const hoje = hojeISO();
form.elements.dataInicio.min = hoje;
form.elements.dataFim.min = hoje;

function novoFormulario() {
  form.reset();
  form.elements.id.value = '';
  document.getElementById('tituloForm').textContent = 'Novo pedido de aluguel';
}

async function carregarTabela() {
  const [pedidos, contratos] = await Promise.all([
    PedidoService.listarPorCliente(usuario.id),
    ContratoService.listar(),
  ]);
  pedidos.sort((a, b) => b.id - a.id);
  PedidoView.renderizarTabela(tabela, pedidos, automoveis, contratos);
}

async function iniciar() {
  automoveis = await AutomovelService.listar();
  form.elements.automovelId.innerHTML = PedidoView.opcoesAutomoveis(automoveis);
  await carregarTabela();
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const dados = PedidoView.lerFormulario(form);
    if (dados.dataInicio && dados.dataInicio < hoje) throw new Error('A data de início não pode ser anterior a hoje.');
    let pedido;
    if (dados.id) {
      const atual = await PedidoService.buscarPorId(dados.id);
      if (!atual.podeSerModificadoPeloCliente()) throw new Error('Este pedido já foi avaliado e não pode ser modificado.');
      pedido = new Pedido({ ...atual, ...dados });
    } else {
      pedido = new Pedido({ ...dados, id: null, clienteId: usuario.id });
    }
    await PedidoService.salvar(pedido);
    mostrarAlerta(dados.id ? 'Pedido modificado com sucesso!' : 'Pedido enviado para análise!');
    novoFormulario();
    carregarTabela();
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger');
  }
});

document.getElementById('btnLimpar').addEventListener('click', novoFormulario);

tabela.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);

  try {
    if (botao.dataset.acao === 'editar') {
      PedidoView.preencherFormulario(form, await PedidoService.buscarPorId(id));
      document.getElementById('tituloForm').textContent = `Modificando pedido #${id}`;
    } else if (botao.dataset.acao === 'cancelar' && confirm('Deseja realmente cancelar este pedido?')) {
      await PedidoService.cancelar(id);
      mostrarAlerta('Pedido cancelado.');
      carregarTabela();
    }
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger');
  }
});

if (usuario) iniciar().catch((erro) => mostrarAlerta(erro.message, 'danger'));
