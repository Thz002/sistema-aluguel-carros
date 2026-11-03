import { Api } from './Api.js';

const CHAVE = 'usuarioLogado';

// Sessão simulada no navegador (protótipo: não é autenticação segura).
// "Lembrar de mim" usa o localStorage (persiste); sem ele, o sessionStorage (some ao fechar o navegador).
// Formato salvo: { id, nome, tipo } com tipo = 'CLIENTE' | 'EMPRESA' | 'BANCO'.
export const SessaoService = {
  // Procura o login/senha entre clientes e agentes. Retorna o usuário ou null.
  async autenticar(login, senha, lembrar = true) {
    const [clientes, agentes] = await Promise.all([
      Api.listar('clientes', { login, senha }),
      Api.listar('agentes', { login, senha }),
    ]);

    let usuario = null;
    if (clientes.length) usuario = { id: clientes[0].id, nome: clientes[0].nome, tipo: 'CLIENTE' };
    else if (agentes.length) usuario = { id: agentes[0].id, nome: agentes[0].nome, tipo: agentes[0].tipo };

    if (usuario) {
      this.encerrar();
      this.salvar(usuario, lembrar);
    }
    return usuario;
  },

  // Sem o parâmetro "lembrar", mantém a sessão no mesmo armazenamento em que já está.
  salvar(usuario, lembrar = localStorage.getItem(CHAVE) !== null) {
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem(CHAVE, JSON.stringify(usuario));
  },

  obter() {
    return JSON.parse(localStorage.getItem(CHAVE) ?? sessionStorage.getItem(CHAVE));
  },

  encerrar() {
    localStorage.removeItem(CHAVE);
    sessionStorage.removeItem(CHAVE);
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
