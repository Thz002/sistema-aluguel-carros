// Proprietário do automóvel: um cliente ou um agente (empresa ou banco).
export const TipoProprietario = Object.freeze({
  CLIENTE: 'CLIENTE',
  AGENTE: 'AGENTE',
});

export class Automovel {
  constructor({ id = null, matricula = '', ano = '', marca = '', modelo = '', placa = '', proprietarioTipo = TipoProprietario.AGENTE, proprietarioId = null } = {}) {
    this.id = id ? Number(id) : null;
    this.matricula = matricula;
    this.ano = Number(ano) || '';
    this.marca = marca;
    this.modelo = modelo;
    this.placa = placa.toUpperCase();
    this.proprietarioTipo = proprietarioTipo;
    this.proprietarioId = proprietarioId === null ? null : Number(proprietarioId);
  }

  descricao() {
    return `${this.marca} ${this.modelo} ${this.ano} (${this.placa})`;
  }

  validar() {
    const erros = [];
    if (!this.matricula.trim()) erros.push('Matrícula é obrigatória.');
    if (!this.marca.trim()) erros.push('Marca é obrigatória.');
    if (!this.modelo.trim()) erros.push('Modelo é obrigatório.');
    if (!this.placa.trim()) erros.push('Placa é obrigatória.');
    if (!this.ano || this.ano < 1950) erros.push('Ano inválido.');
    return erros;
  }
}
