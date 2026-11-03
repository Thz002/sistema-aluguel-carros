import { SessaoService } from '../services/SessaoService.js';
import { renderizarNavbar } from '../views/componentes.js';

// Inicialização comum das páginas: verifica a sessão e monta a navbar.
// Retorna o usuário logado (ou null em páginas públicas sem login).
export function iniciarPagina({ tiposPermitidos = [], publica = false } = {}) {
  const usuario = publica ? SessaoService.obter() : SessaoService.exigir(...tiposPermitidos);
  if (!publica && !usuario) return null;

  renderizarNavbar(usuario, () => {
    SessaoService.encerrar();
    window.location.href = 'login.html';
  });
  return usuario;
}
