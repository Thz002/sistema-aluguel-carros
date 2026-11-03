// Classe base para todos os usuários do sistema (clientes e agentes).
export class Usuario {
  constructor({ id = null, login = '', senha = '', nome = '' } = {}) {
    this.id = id ? Number(id) : null;
    this.login = login;
    this.senha = senha;
    this.nome = nome;
  }

  validar() {
    const erros = [];
    if (!this.nome.trim()) erros.push('Nome é obrigatório.');
    if (!this.login.trim()) erros.push('Login é obrigatório.');
    if (!this.senha.trim()) erros.push('Senha é obrigatória.');
    return erros;
  }
}
