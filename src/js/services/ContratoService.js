import { BaseService } from './BaseService.js';
import { PedidoService } from './PedidoService.js';
import { AutomovelService } from './AutomovelService.js';
import { AgenteService } from './AgenteService.js';
import { Contrato } from '../models/Contrato.js';
import { TipoAgente } from '../models/Agente.js';

class ContratoServiceImpl extends BaseService {
  constructor() {
    super('contratos', Contrato);
  }

  async executar(dadosContrato) {
    const contrato = new Contrato(dadosContrato);
    const erros = contrato.validar();
    if (erros.length) throw new Error(erros.join(' '));

    if (contrato.credito) {
      const banco = await AgenteService.buscarPorId(contrato.credito.bancoId);
      if (banco.tipo !== TipoAgente.BANCO) throw new Error('Somente bancos podem conceder crédito.');
    }

    const pedido = await PedidoService.buscarPorId(contrato.pedidoId);
    pedido.marcarComoContratado();

    const salvo = await this.salvar(contrato);
    await PedidoService.salvar(pedido);

    const automovel = await AutomovelService.buscarPorId(pedido.automovelId);
    automovel.proprietarioTipo = contrato.proprietarioTipo;
    automovel.proprietarioId = contrato.proprietarioId;
    await AutomovelService.salvar(automovel);

    return salvo;
  }
}

export const ContratoService = new ContratoServiceImpl();
