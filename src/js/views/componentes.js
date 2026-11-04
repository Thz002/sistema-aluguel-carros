export function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

const CORES_STATUS = {
  PENDENTE: 'warning',
  APROVADO: 'info',
  REPROVADO: 'danger',
  CANCELADO: 'secondary',
  CONTRATADO: 'success',
};

export function badgeStatus(status) {
  return `<span class="badge text-bg-${CORES_STATUS[status] || 'light'}">${escapar(status)}</span>`;
}

export function mostrarAlerta(mensagem, tipo = 'success', areaId = 'alertas') {
  const area = document.getElementById(areaId);
  area.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${escapar(mensagem)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
  if (areaId === 'alertas') window.scrollTo({ top: 0, behavior: 'smooth' });
}

function linksPorTipo(usuario) {
  if (!usuario) return [{ href: 'login.html', texto: 'Entrar' }];
  if (usuario.tipo === 'CLIENTE') {
    return [
      { href: 'pedidos.html', texto: 'Meus pedidos' },
      { href: 'clientes.html', texto: 'Meus dados' },
    ];
  }
  return [
    { href: 'avaliacao.html', texto: 'Avaliar pedidos' },
    { href: 'clientes.html', texto: 'Clientes' },
    { href: 'automoveis.html', texto: 'Automóveis' },
  ];
}

export function renderizarNavbar(usuario, aoSair) {
  const paginaAtual = window.location.pathname.split('/').pop();
  const links = linksPorTipo(usuario)
    .map((l) => `
      <li class="nav-item">
        <a class="nav-link ${l.href === paginaAtual ? 'active' : ''}" href="${l.href}">${l.texto}</a>
      </li>`)
    .join('');

  const areaUsuario = usuario
    ? `<span class="navbar-text me-3"><i class="bi bi-person-circle"></i> ${escapar(usuario.nome)} (${escapar(usuario.tipo)})</span>
       <button id="btnSair" class="btn btn-outline-light btn-sm">Sair</button>`
    : '';

  document.getElementById('navbar').innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-vertice mb-4">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <svg class="marca-simbolo" viewBox="0 0 40 36" aria-hidden="true"><path d="M2 2 L20 34 L38 2" /><path d="M11 2 L20 18 L29 2" /></svg>
          <span class="marca-nome">VÉRTICE</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav me-auto">${links}</ul>
          ${areaUsuario}
        </div>
      </div>
    </nav>`;

  document.getElementById('btnSair')?.addEventListener('click', aoSair);
}
