import { BaseService } from './BaseService.js';
import { Pedido, StatusPedido } from '../models/Pedido.js';

class PedidoServiceImpl extends BaseService {
  constructor() {
    super('pedidos', Pedido);
  }

  listarPorCliente(clienteId) {
    return this.listar({ clienteId });
  }

  async verificarDisponibilidade(pedido) {
    const outros = await this.listar({ automovelId: pedido.automovelId });
    if (outros.some((outro) => outro.reservaAutomovel() && pedido.conflitaCom(outro))) {
      throw new Error('Este automóvel já está reservado nesse período.');
    }
  }

  async salvar(pedido) {
    if ([StatusPedido.PENDENTE, StatusPedido.APROVADO].includes(pedido.status)) {
      await this.verificarDisponibilidade(pedido);
    }
    return super.salvar(pedido);
  }

  async cancelar(id) {
    const pedido = await this.buscarPorId(id);
    pedido.cancelar();
    return this.salvar(pedido);
  }

  async avaliar(id, agenteId, aprovado, parecer) {
    const pedido = await this.buscarPorId(id);
    pedido.avaliar(agenteId, aprovado, parecer);
    return this.salvar(pedido);
  }
}

export const PedidoService = new PedidoServiceImpl();
