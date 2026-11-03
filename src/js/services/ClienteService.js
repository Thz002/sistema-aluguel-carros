import { BaseService } from './BaseService.js';
import { Api } from './Api.js';
import { Cliente } from '../models/Cliente.js';

class ClienteServiceImpl extends BaseService {
  constructor() {
    super('clientes', Cliente);
  }

  // Login precisa ser único entre clientes e agentes.
  async loginDisponivel(login, idAtual = null) {
    const [clientes, agentes] = await Promise.all([
      Api.listar('clientes', { login }),
      Api.listar('agentes', { login }),
    ]);
    return agentes.length === 0 && clientes.every((c) => Number(c.id) === Number(idAtual));
  }

  async salvar(cliente) {
    if (!(await this.loginDisponivel(cliente.login, cliente.id))) {
      throw new Error('Este login já está em uso.');
    }
    return super.salvar(cliente);
  }

  async remover(id) {
    const pedidos = await Api.listar('pedidos', { clienteId: id });
    if (pedidos.length) throw new Error('Cliente possui pedidos cadastrados e não pode ser excluído.');
    return super.remover(id);
  }
}

export const ClienteService = new ClienteServiceImpl();
