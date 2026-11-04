import { escapar } from './componentes.js';

export function chaveProprietario(tipo, id) {
  return `${tipo}:${id}`;
}

export function nomeProprietario(automovelOuContrato, clientes, agentes) {
  const { proprietarioTipo, proprietarioId } = automovelOuContrato;
  if (proprietarioTipo === 'CLIENTE') {
    const cliente = clientes.find((c) => c.id === proprietarioId);
    return cliente ? `${cliente.nome} (cliente)` : '—';
  }
  const agente = agentes.find((a) => a.id === proprietarioId);
  return agente ? `${agente.nome} (${agente.tipo.toLowerCase()})` : '—';
}

export function opcoesProprietario(clientes, agentes, selecionado = '') {
  const opcao = (tipo, p, rotulo) => {
    const chave = chaveProprietario(tipo, p.id);
    return `<option value="${chave}" ${chave === selecionado ? 'selected' : ''}>${escapar(p.nome)} (${rotulo})</option>`;
  };
  return `
    <optgroup label="Agentes">${agentes.map((a) => opcao('AGENTE', a, a.tipo.toLowerCase())).join('')}</optgroup>
    <optgroup label="Clientes">${clientes.map((c) => opcao('CLIENTE', c, 'cliente')).join('')}</optgroup>`;
}

export const AutomovelView = {
  renderizarTabela(tbody, automoveis, clientes, agentes) {
    if (!automoveis.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum automóvel cadastrado.</td></tr>';
      return;
    }
    tbody.innerHTML = automoveis.map((a) => `
      <tr>
        <td>${escapar(a.matricula)}</td>
        <td>${escapar(a.placa)}</td>
        <td>${escapar(`${a.marca} ${a.modelo}`)}</td>
        <td>${a.ano}</td>
        <td>${escapar(nomeProprietario(a, clientes, agentes))}</td>
        <td class="text-end text-nowrap">
          <button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="${a.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${a.id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`).join('');
  },

  preencherFormulario(form, automovel) {
    ['id', 'matricula', 'ano', 'marca', 'modelo', 'placa'].forEach((campo) => {
      form.elements[campo].value = automovel[campo] ?? '';
    });
    form.elements.proprietario.value = chaveProprietario(automovel.proprietarioTipo, automovel.proprietarioId);
  },

  lerFormulario(form) {
    const dados = Object.fromEntries(new FormData(form));
    const [proprietarioTipo, proprietarioId] = dados.proprietario.split(':');
    delete dados.proprietario;
    return { ...dados, proprietarioTipo, proprietarioId };
  },
};
