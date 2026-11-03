import { Api } from './Api.js';

const CHAVE = 'usuarioLogado';

// Sessão simulada no localStorage (protótipo: não é autenticação segura).
// Formato salvo: { id, nome, tipo } com tipo = 'CLIENTE' | 'EMPRESA' | 'BANCO'.
export const SessaoService = {
  // Procura o login/senha entre clientes e agentes. Retorna o usuário ou null.
  async autenticar(login, senha) {
    const [clientes, agentes] = await Promise.all([
      Api.listar('clientes', { login, senha }),
      Api.listar('agentes', { login, senha }),
    ]);

    let usuario = null;
    if (clientes.length) usuario = { id: clientes[0].id, nome: clientes[0].nome, tipo: 'CLIENTE' };
    else if (agentes.length) usuario = { id: agentes[0].id, nome: agentes[0].nome, tipo: agentes[0].tipo };

    if (usuario) this.salvar(usuario);
    return usuario;
  },

  salvar(usuario) {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
  },

  obter() {
    return JSON.parse(localStorage.getItem(CHAVE));
  },

  encerrar() {
    localStorage.removeItem(CHAVE);
  },

  ehAgente(usuario) {
    return usuario && usuario.tipo !== 'CLIENTE';
  },

  // Protege a página: sem sessão vai para o login; tipo não permitido vai para o início.
  exigir(...tiposPermitidos) {
    const usuario = this.obter();
    if (!usuario) {
      window.location.href = 'login.html';
      return null;
    }
    if (tiposPermitidos.length && !tiposPermitidos.includes(usuario.tipo)) {
      window.location.href = 'index.html';
      return null;
    }
    return usuario;
  },
};
