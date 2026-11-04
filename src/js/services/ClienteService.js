import { BaseService } from './BaseService.js';
import { Api } from './Api.js';
import { Cliente } from '../models/Cliente.js';

class ClienteServiceImpl extends BaseService {
  constructor() {
    super('clientes', Cliente);
  }

  async loginDisponivel(login, idAtual = null) {
    const [clientes, agentes] = await Promise.all([
      Api.listar('clientes', { login }),
      Api.listar('agentes', { login }),
    ]);
    return agentes.length === 0 && clientes.every((c) => Number(c.id) === Number(idAtual));
  }

  async cpfDisponivel(cpf, idAtual = null) {
    const clientes = await Api.listar('clientes', { cpf });
    return clientes.every((c) => Number(c.id) === Number(idAtual));
  }

  async salvar(cliente) {
    if (!(await this.loginDisponivel(cliente.login, cliente.id))) {
      throw new Error('Este login já está em uso.');
    }
    if (!(await this.cpfDisponivel(cliente.cpf, cliente.id))) {
      throw new Error('Já existe um cliente cadastrado com este CPF.');
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
