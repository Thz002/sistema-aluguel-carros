import { escapar, formatarData, formatarMoeda, badgeStatus } from './componentes.js';
import { descricaoAutomovel } from './PedidoView.js';
import { nomeProprietario } from './AutomovelView.js';

export const AvaliacaoView = {
  renderizarPedidos(tbody, pedidos, clientes, automoveis) {
    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum pedido encontrado.</td></tr>';
      return;
    }
    tbody.innerHTML = pedidos.map((p) => {
      const cliente = clientes.find((c) => c.id === p.clienteId);
      const acoes = [
        p.podeSerModificadoPeloAgente() && `<button class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="${p.id}" title="Modificar"><i class="bi bi-pencil"></i></button>`,
        p.podeSerAvaliado() && `<button class="btn btn-sm btn-outline-warning" data-acao="avaliar" data-id="${p.id}" title="Avaliar"><i class="bi bi-clipboard-check"></i></button>`,
        p.podeGerarContrato() && `<button class="btn btn-sm btn-outline-success" data-acao="contrato" data-id="${p.id}" title="Executar contrato"><i class="bi bi-file-earmark-text"></i></button>`,
      ].filter(Boolean).join(' ');

      return `
        <tr>
          <td>#${p.id}</td>
          <td>${escapar(cliente?.nome ?? '—')}<div class="small text-muted">Renda: ${formatarMoeda(cliente?.rendaTotal())}</div></td>
          <td>${escapar(descricaoAutomovel(automoveis, p.automovelId))}</td>
          <td>${formatarData(p.dataInicio)} a ${formatarData(p.dataFim)}</td>
          <td>${badgeStatus(p.status)}</td>
          <td class="text-end text-nowrap">${acoes}</td>
        </tr>`;
    }).join('');
  },

  renderizarContratos(tbody, contratos, clientes, agentes) {
    if (!contratos.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum contrato executado.</td></tr>';
      return;
    }
    tbody.innerHTML = contratos.map((c) => {
      const banco = c.credito && agentes.find((a) => a.id === c.credito.bancoId);
      const credito = c.credito
        ? `${escapar(banco?.nome ?? '—')}: ${formatarMoeda(c.credito.valor)} em ${c.credito.parcelas}x de ${formatarMoeda(c.credito.valorParcela())}`
        : '—';
      return `
        <tr>
          <td>#${c.id}</td>
          <td>#${c.pedidoId}</td>
          <td>${c.tipo === 'CREDITO' ? 'Com crédito' : 'Simples'}</td>
          <td>${escapar(nomeProprietario(c, clientes, agentes))}</td>
          <td class="small">${credito}</td>
          <td>${formatarData(c.dataAssinatura)}</td>
        </tr>`;
    }).join('');
  },

  resumoPedido(pedido, cliente, automoveis) {
    return `
      <p class="mb-1"><strong>Pedido #${pedido.id}</strong> — ${escapar(descricaoAutomovel(automoveis, pedido.automovelId))}</p>
      <p class="mb-1">Período: ${formatarData(pedido.dataInicio)} a ${formatarData(pedido.dataFim)}</p>
      <p class="mb-1">Cliente: ${escapar(cliente?.nome ?? '—')} — ${escapar(cliente?.profissao ?? '')}</p>
      <ul class="small mb-0">
        ${(cliente?.empregos ?? []).map((e) => `<li>${escapar(e.entidade)}: ${formatarMoeda(e.rendimento)}</li>`).join('')}
      </ul>
      <p class="fw-semibold">Renda total: ${formatarMoeda(cliente?.rendaTotal())}</p>`;
  },
};
