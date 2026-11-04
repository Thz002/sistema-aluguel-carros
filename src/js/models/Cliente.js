import { Usuario } from './Usuario.js';

export const MAX_EMPREGOS = 3;

export class Emprego {
  constructor({ entidade = '', rendimento = 0 } = {}) {
    this.entidade = entidade;
    this.rendimento = Number(rendimento) || 0;
  }
}

export class Cliente extends Usuario {
  constructor(dados = {}) {
    super(dados);
    this.rg = dados.rg || '';
    this.cpf = dados.cpf || '';
    this.endereco = dados.endereco || '';
    this.profissao = dados.profissao || '';
    this.empregos = (dados.empregos || []).map((e) => new Emprego(e));
  }

  get tipo() {
    return 'CLIENTE';
  }

  rendaTotal() {
    return this.empregos.reduce((soma, e) => soma + e.rendimento, 0);
  }

  validar() {
    const erros = super.validar();
    if (!this.rg.trim()) erros.push('RG é obrigatório.');
    if (this.cpf.replace(/\D/g, '').length !== 11) erros.push('CPF deve ter 11 dígitos.');
    if (!this.endereco.trim()) erros.push('Endereço é obrigatório.');
    if (this.empregos.length > MAX_EMPREGOS) {
      erros.push(`Informe no máximo ${MAX_EMPREGOS} rendimentos.`);
    }
    return erros;
  }
}
