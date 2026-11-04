import { escapar, formatarData, badgeStatus } from './componentes.js';

export function descricaoAutomovel(automoveis, id) {
  const automovel = automoveis.find((a) => a.id === id);
  return automovel ? automovel.descricao() : '—';
}

export const PedidoView = {
  opcoesAutomoveis(automoveis) {
    return '<option value="">Selecione...</option>' +
      automoveis.map((a) => `<option value="${a.id}">${escapar(a.descricao())}</option>`).join('');
  },

  renderizarTabela(tbody, pedidos, automoveis, contratos) {
    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Você ainda não fez nenhum pedido.</td></tr>';
      return;
    }
    tbody.innerHTML = pedidos.map((p) => {
      const contrato = contratos.find((c) => c.pedidoId === p.id);
      const acoes = [
        p.podeSerModificadoPeloCliente() && `<button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="${p.id}" title="Modificar"><i class="bi bi-pencil"></i></button>`,
        p.podeSerCancelado() && `<button class="btn btn-sm btn-outline-danger" data-acao="cancelar" data-id="${p.id}" title="Cancelar"><i class="bi bi-x-circle"></i></button>`,
      ].filter(Boolean).join(' ');

      return `
        <tr>
          <td>#${p.id}</td>
          <td>${escapar(descricaoAutomovel(automoveis, p.automovelId))}</td>
          <td>${formatarData(p.dataInicio)} a ${formatarData(p.dataFim)}</td>
          <td>${badgeStatus(p.status)}${contrato ? `<div class="small text-muted">Contrato #${contrato.id} (${contrato.tipo.toLowerCase()})</div>` : ''}</td>
          <td class="small">${escapar(p.parecer) || '—'}</td>
          <td class="text-end text-nowrap">${acoes}</td>
        </tr>`;
    }).join('');
  },

  preencherFormulario(form, pedido) {
    ['id', 'automovelId', 'dataInicio', 'dataFim'].forEach((campo) => {
      form.elements[campo].value = pedido[campo] ?? '';
    });
  },

  lerFormulario(form) {
    return Object.fromEntries(new FormData(form));
  },
};
