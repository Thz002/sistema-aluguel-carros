import { BaseService } from './BaseService.js';
import { Agente, TipoAgente } from '../models/Agente.js';

class AgenteServiceImpl extends BaseService {
  constructor() {
    super('agentes', Agente);
  }

  criarInstancia(dados) {
    return Agente.criar(dados);
  }

  listarBancos() {
    return this.listar({ tipo: TipoAgente.BANCO });
  }
}

export const AgenteService = new AgenteServiceImpl();
