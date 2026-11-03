import { BaseService } from './BaseService.js';
import { Api } from './Api.js';
import { Automovel } from '../models/Automovel.js';

class AutomovelServiceImpl extends BaseService {
  constructor() {
    super('automoveis', Automovel);
  }

  async remover(id) {
    const pedidos = await Api.listar('pedidos', { automovelId: id });
    if (pedidos.length) throw new Error('Automóvel possui pedidos e não pode ser excluído.');
    return super.remover(id);
  }
}

export const AutomovelService = new AutomovelServiceImpl();
