import { BaseService } from './BaseService.js';
import { PedidoService } from './PedidoService.js';
import { AutomovelService } from './AutomovelService.js';
import { Contrato } from '../models/Contrato.js';

class ContratoServiceImpl extends BaseService {
  constructor() {
    super('contratos', Contrato);
  }

  // Executa o contrato de um pedido aprovado: grava o contrato, marca o pedido
  // como CONTRATADO e registra o proprietário do automóvel.
  async executar(dadosContrato) {
    const contrato = new Contrato(dadosContrato);
    const erros = contrato.validar();
    if (erros.length) throw new Error(erros.join(' '));

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
