import { hojeISO } from './datas.js';

export const StatusPedido = Object.freeze({
  PENDENTE: 'PENDENTE',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
  CANCELADO: 'CANCELADO',
  CONTRATADO: 'CONTRATADO',
});

export class Pedido {
  constructor({ id = null, clienteId = null, automovelId = null, dataInicio = '', dataFim = '', status = StatusPedido.PENDENTE, parecer = '', agenteId = null, dataCriacao = hojeISO() } = {}) {
    this.id = id ? Number(id) : null;
    this.clienteId = clienteId === null ? null : Number(clienteId);
    this.automovelId = automovelId === null ? null : Number(automovelId);
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    this.status = status;
    this.parecer = parecer;
    this.agenteId = agenteId === null ? null : Number(agenteId);
    this.dataCriacao = dataCriacao;
  }

  podeSerModificadoPeloCliente() {
    return this.status === StatusPedido.PENDENTE;
  }

  podeSerModificadoPeloAgente() {
    return [StatusPedido.PENDENTE, StatusPedido.APROVADO].includes(this.status);
  }

  podeSerCancelado() {
    return [StatusPedido.PENDENTE, StatusPedido.APROVADO].includes(this.status);
  }

  podeSerAvaliado() {
    return this.status === StatusPedido.PENDENTE;
  }

  podeGerarContrato() {
    return this.status === StatusPedido.APROVADO;
  }

  reservaAutomovel() {
    return [StatusPedido.APROVADO, StatusPedido.CONTRATADO].includes(this.status);
  }

  conflitaCom(outro) {
    return outro.id !== this.id
      && outro.automovelId === this.automovelId
      && this.dataInicio <= outro.dataFim
      && outro.dataInicio <= this.dataFim;
  }

  cancelar() {
    if (!this.podeSerCancelado()) throw new Error('Este pedido não pode mais ser cancelado.');
    this.status = StatusPedido.CANCELADO;
  }

  avaliar(agenteId, aprovado, parecer) {
    if (!this.podeSerAvaliado()) throw new Error('Somente pedidos pendentes podem ser avaliados.');
    this.agenteId = Number(agenteId);
    this.parecer = parecer;
    this.status = aprovado ? StatusPedido.APROVADO : StatusPedido.REPROVADO;
  }

  marcarComoContratado() {
    if (!this.podeGerarContrato()) throw new Error('Somente pedidos aprovados geram contrato.');
    this.status = StatusPedido.CONTRATADO;
  }

  validar() {
    const erros = [];
    if (!this.clienteId) erros.push('Cliente é obrigatório.');
    if (!this.automovelId) erros.push('Selecione um automóvel.');
    if (!this.dataInicio || !this.dataFim) erros.push('Informe as datas de início e fim.');
    else if (this.dataFim < this.dataInicio) erros.push('A data de fim deve ser posterior à de início.');
    return erros;
  }
}
