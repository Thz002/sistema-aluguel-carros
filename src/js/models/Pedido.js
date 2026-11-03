export const StatusPedido = Object.freeze({
  PENDENTE: 'PENDENTE',     // criado pelo cliente, aguardando análise financeira
  APROVADO: 'APROVADO',     // parecer positivo do agente, aguardando contrato
  REPROVADO: 'REPROVADO',   // parecer negativo do agente
  CANCELADO: 'CANCELADO',   // cancelado pelo cliente
  CONTRATADO: 'CONTRATADO', // contrato executado
});

export class Pedido {
  constructor({ id = null, clienteId = null, automovelId = null, dataInicio = '', dataFim = '', status = StatusPedido.PENDENTE, parecer = '', agenteId = null, dataCriacao = new Date().toISOString().slice(0, 10) } = {}) {
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

  // O cliente só altera o pedido enquanto ele não foi avaliado.
  podeSerModificadoPeloCliente() {
    return this.status === StatusPedido.PENDENTE;
  }

  // O agente pode alterar pedidos que ainda não viraram contrato.
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
