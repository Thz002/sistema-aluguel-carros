import { escapar, formatarMoeda } from './componentes.js';
import { MAX_EMPREGOS } from '../models/Cliente.js';

export const ClienteView = {
  renderizarTabela(tbody, clientes) {
    if (!clientes.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum cliente cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = clientes.map((c) => `
      <tr>
        <td>${escapar(c.nome)}</td>
        <td>${escapar(c.cpf)}</td>
        <td>${escapar(c.profissao)}</td>
        <td>${formatarMoeda(c.rendaTotal())}</td>
        <td class="text-end text-nowrap">
          <button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="${c.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${c.id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`).join('');
  },

  adicionarEmprego(container, emprego = { entidade: '', rendimento: '' }) {
    const linha = document.createElement('div');
    linha.className = 'emprego row g-2 mb-2';
    linha.innerHTML = `
      <div class="col-7"><input class="form-control" name="entidade" placeholder="Entidade empregadora" value="${escapar(emprego.entidade)}" required></div>
      <div class="col-4"><input class="form-control" name="rendimento" type="number" min="0" step="0.01" placeholder="Rendimento" value="${escapar(String(emprego.rendimento))}" required></div>
      <div class="col-1"><button type="button" class="btn btn-outline-danger w-100" data-acao="remover-emprego"><i class="bi bi-x"></i></button></div>`;
    container.appendChild(linha);
  },

  // Desabilita o botão quando o limite de rendimentos é atingido.
  atualizarBotaoEmprego(container, botao) {
    botao.disabled = container.querySelectorAll('.emprego').length >= MAX_EMPREGOS;
  },

  preencherFormulario(form, cliente) {
    ['id', 'nome', 'login', 'senha', 'rg', 'cpf', 'endereco', 'profissao'].forEach((campo) => {
      form.elements[campo].value = cliente[campo] ?? '';
    });
    const container = form.querySelector('#empregos');
    container.innerHTML = '';
    cliente.empregos.forEach((e) => this.adicionarEmprego(container, e));
  },

  lerFormulario(form) {
    const dados = Object.fromEntries(new FormData(form));
    dados.empregos = [...form.querySelectorAll('.emprego')].map((linha) => ({
      entidade: linha.querySelector('[name=entidade]').value,
      rendimento: linha.querySelector('[name=rendimento]').value,
    }));
    delete dados.entidade;
    delete dados.rendimento;
    return dados;
  },

  limparFormulario(form) {
    form.reset();
    form.elements.id.value = '';
    form.querySelector('#empregos').innerHTML = '';
  },
};
