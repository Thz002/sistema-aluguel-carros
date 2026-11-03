import { Usuario } from './Usuario.js';

export const TipoAgente = Object.freeze({
  EMPRESA: 'EMPRESA',
  BANCO: 'BANCO',
});

// Agentes (empresas e bancos) modificam e avaliam pedidos.
export class Agente extends Usuario {
  constructor(dados = {}) {
    super(dados);
    this.cnpj = dados.cnpj || '';
  }

  // Cria a subclasse correta a partir do campo "tipo" salvo no db.json.
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
