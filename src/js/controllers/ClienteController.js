import { iniciarPagina } from './pagina.js';
import { ClienteService } from '../services/ClienteService.js';
import { SessaoService } from '../services/SessaoService.js';
import { Cliente } from '../models/Cliente.js';
import { ClienteView } from '../views/ClienteView.js';
import { mostrarAlerta } from '../views/componentes.js';

// Página pública: sem login funciona como cadastro; cliente edita os próprios
// dados; agente tem acesso ao CRUD completo.
const usuario = iniciarPagina({ publica: true });
const ehAgente = SessaoService.ehAgente(usuario);
const ehCliente = usuario?.tipo === 'CLIENTE';

const form = document.getElementById('formCliente');
const empregos = document.getElementById('empregos');
const btnAddEmprego = document.getElementById('btnAddEmprego');
const tabela = document.getElementById('tabelaClientes');

function novoFormulario() {
  ClienteView.limparFormulario(form);
  ClienteView.atualizarBotaoEmprego(empregos, btnAddEmprego);
  document.getElementById('tituloForm').textContent = ehAgente ? 'Novo cliente' : 'Cadastro de cliente';
}

async function carregarTabela() {
  ClienteView.renderizarTabela(tabela, await ClienteService.listar());
}

async function editar(id) {
  const cliente = await ClienteService.buscarPorId(id);
  ClienteView.preencherFormulario(form, cliente);
  ClienteView.atualizarBotaoEmprego(empregos, btnAddEmprego);
  document.getElementById('tituloForm').textContent = ehCliente ? 'Meus dados' : `Editando: ${cliente.nome}`;
}

btnAddEmprego.addEventListener('click', () => {
  ClienteView.adicionarEmprego(empregos);
  ClienteView.atualizarBotaoEmprego(empregos, btnAddEmprego);
});

empregos.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-acao=remover-emprego]');
  if (!botao) return;
  botao.closest('.emprego').remove();
  ClienteView.atualizarBotaoEmprego(empregos, btnAddEmprego);
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const cliente = new Cliente(ClienteView.lerFormulario(form));
    const salvo = await ClienteService.salvar(cliente);

    if (!usuario) {
      mostrarAlerta('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => (window.location.href = 'login.html'), 2000);
      return;
    }
    if (ehCliente) {
      SessaoService.salvar({ ...usuario, nome: salvo.nome });
      iniciarPagina({ publica: true });
      mostrarAlerta('Dados atualizados com sucesso!');
      return;
    }
    mostrarAlerta(cliente.id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
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

  if (botao.dataset.acao === 'editar') {
    editar(id);
  } else if (botao.dataset.acao === 'excluir' && confirm('Deseja realmente excluir este cliente?')) {
    try {
      await ClienteService.remover(id);
      mostrarAlerta('Cliente excluído com sucesso!');
      carregarTabela();
    } catch (erro) {
      mostrarAlerta(erro.message, 'danger');
    }
  }
});

// Ajusta a tela conforme o tipo de acesso.
novoFormulario();
if (ehAgente) {
  carregarTabela().catch((erro) => mostrarAlerta(erro.message, 'danger'));
} else {
  document.getElementById('secaoLista').remove();
  document.getElementById('btnLimpar').classList.add('d-none');
  if (ehCliente) editar(usuario.id).catch((erro) => mostrarAlerta(erro.message, 'danger'));
}
