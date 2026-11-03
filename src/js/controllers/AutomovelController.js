import { iniciarPagina } from './pagina.js';
import { AutomovelService } from '../services/AutomovelService.js';
import { ClienteService } from '../services/ClienteService.js';
import { AgenteService } from '../services/AgenteService.js';
import { Automovel } from '../models/Automovel.js';
import { AutomovelView, opcoesProprietario, chaveProprietario } from '../views/AutomovelView.js';
import { mostrarAlerta } from '../views/componentes.js';

const usuario = iniciarPagina({ tiposPermitidos: ['EMPRESA', 'BANCO'] });

const form = document.getElementById('formAutomovel');
const tabela = document.getElementById('tabelaAutomoveis');
let clientes = [];
let agentes = [];

function novoFormulario() {
  form.reset();
  form.elements.id.value = '';
  form.elements.proprietario.value = chaveProprietario('AGENTE', usuario.id);
  document.getElementById('tituloForm').textContent = 'Novo automóvel';
}

async function carregarTabela() {
  AutomovelView.renderizarTabela(tabela, await AutomovelService.listar(), clientes, agentes);
}

async function iniciar() {
  [clientes, agentes] = await Promise.all([ClienteService.listar(), AgenteService.listar()]);
  form.elements.proprietario.innerHTML = opcoesProprietario(clientes, agentes);
  novoFormulario();
  await carregarTabela();
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const automovel = new Automovel(AutomovelView.lerFormulario(form));
    await AutomovelService.salvar(automovel);
    mostrarAlerta(automovel.id ? 'Automóvel atualizado com sucesso!' : 'Automóvel cadastrado com sucesso!');
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
      AutomovelView.preencherFormulario(form, await AutomovelService.buscarPorId(id));
      document.getElementById('tituloForm').textContent = 'Editando automóvel';
    } else if (botao.dataset.acao === 'excluir' && confirm('Deseja realmente excluir este automóvel?')) {
      await AutomovelService.remover(id);
      mostrarAlerta('Automóvel excluído com sucesso!');
      carregarTabela();
    }
  } catch (erro) {
    mostrarAlerta(erro.message, 'danger');
  }
});

if (usuario) iniciar().catch((erro) => mostrarAlerta(erro.message, 'danger'));
