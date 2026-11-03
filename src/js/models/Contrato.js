import { TipoProprietario } from './Automovel.js';

export const TipoContrato = Object.freeze({
  SIMPLES: 'SIMPLES',
  CREDITO: 'CREDITO',
});

// Contrato de crédito concedido por um dos bancos agentes.
export class ContratoCredito {
  constructor({ bancoId = null, valor = 0, parcelas = 1 } = {}) {
    this.bancoId = bancoId === null ? null : Number(bancoId);
    this.valor = Number(valor) || 0;
    this.parcelas = Number(parcelas) || 1;
  }

  valorParcela() {
    return this.valor / this.parcelas;
  }
}

export class Contrato {
  constructor({ id = null, pedidoId = null, tipo = TipoContrato.SIMPLES, proprietarioTipo = TipoProprietario.CLIENTE, proprietarioId = null, dataAssinatura = new Date().toISOString().slice(0, 10), credito = null } = {}) {
    this.id = id ? Number(id) : null;
    this.pedidoId = pedidoId === null ? null : Number(pedidoId);
    this.tipo = tipo;
    this.proprietarioTipo = proprietarioTipo;
    this.proprietarioId = proprietarioId === null ? null : Number(proprietarioId);
    this.dataAssinatura = dataAssinatura;
    this.credito = tipo === TipoContrato.CREDITO && credito ? new ContratoCredito(credito) : null;
  }

  validar() {
    const erros = [];
    if (!this.pedidoId) erros.push('Pedido é obrigatório.');
    if (!this.proprietarioId) erros.push('Informe o proprietário do automóvel.');
    if (this.tipo === TipoContrato.CREDITO) {
      if (!this.credito || !this.credito.bancoId) erros.push('Contrato de crédito exige um banco.');
      else if (this.credito.valor <= 0) erros.push('Informe o valor do crédito.');
    }
    return erros;
  }
}
