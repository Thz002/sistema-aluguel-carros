import { BaseService } from './BaseService.js';
import { Pedido } from '../models/Pedido.js';

class PedidoServiceImpl extends BaseService {
  constructor() {
    super('pedidos', Pedido);
  }

  listarPorCliente(clienteId) {
    return this.listar({ clienteId });
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
