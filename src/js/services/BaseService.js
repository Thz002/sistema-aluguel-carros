import { Api } from './Api.js';

export class BaseService {
  constructor(recurso, Modelo) {
    this.recurso = recurso;
    this.Modelo = Modelo;
  }

  criarInstancia(dados) {
    return new this.Modelo(dados);
  }

  async listar(filtros = {}) {
    const lista = await Api.listar(this.recurso, filtros);
    return lista.map((dados) => this.criarInstancia(dados));
  }

  async buscarPorId(id) {
    return this.criarInstancia(await Api.buscar(this.recurso, id));
  }

  async salvar(entidade) {
    const erros = entidade.validar();
    if (erros.length) throw new Error(erros.join(' '));

    const dados = { ...entidade };
    if (!dados.id) delete dados.id;
    const salvo = entidade.id
      ? await Api.atualizar(this.recurso, entidade.id, dados)
      : await Api.criar(this.recurso, dados);
    return this.criarInstancia(salvo);
  }

  remover(id) {
    return Api.remover(this.recurso, id);
  }
}
