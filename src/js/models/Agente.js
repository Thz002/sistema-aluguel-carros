import { Usuario } from './Usuario.js';

export const TipoAgente = Object.freeze({
  EMPRESA: 'EMPRESA',
  BANCO: 'BANCO',
});

export class Agente extends Usuario {
  constructor(dados = {}) {
    super(dados);
    this.cnpj = dados.cnpj || '';
  }

  static criar(dados) {
    return dados.tipo === TipoAgente.BANCO ? new Banco(dados) : new Empresa(dados);
  }
}

export class Empresa extends Agente {
  get tipo() {
    return TipoAgente.EMPRESA;
  }
}

export class Banco extends Agente {
  get tipo() {
    return TipoAgente.BANCO;
  }
}
