import { iniciarPagina } from './pagina.js';
import { escapar } from '../views/componentes.js';

const usuario = iniciarPagina();

const ATALHOS = {
  CLIENTE: [
    { href: 'pedidos.html', icone: 'bi-cart-plus', titulo: 'Meus pedidos', texto: 'Faça, modifique, consulte ou cancele seus pedidos de aluguel.' },
    { href: 'clientes.html', icone: 'bi-person-vcard', titulo: 'Meus dados', texto: 'Atualize seus dados pessoais, empregadores e rendimentos.' },
  ],
  AGENTE: [
    { href: 'avaliacao.html', icone: 'bi-clipboard-check', titulo: 'Avaliar pedidos', texto: 'Analise financeiramente os pedidos e execute os contratos.' },
    { href: 'clientes.html', icone: 'bi-people', titulo: 'Clientes', texto: 'Cadastre, consulte, altere ou exclua clientes.' },
    { href: 'automoveis.html', icone: 'bi-car-front', titulo: 'Automóveis', texto: 'Gerencie a frota de automóveis disponíveis.' },
  ],
};

if (usuario) {
  const atalhos = usuario.tipo === 'CLIENTE' ? ATALHOS.CLIENTE : ATALHOS.AGENTE;
  document.getElementById('boasVindas').textContent = `Olá, ${usuario.nome}!`;
  document.getElementById('atalhos').innerHTML = atalhos.map((a) => `
    <div class="col-md-4">
      <a href="${a.href}" class="card h-100 shadow-sm text-decoration-none atalho">
        <div class="card-body">
          <i class="bi ${a.icone} fs-2 text-primary"></i>
          <h2 class="h5 mt-2">${escapar(a.titulo)}</h2>
          <p class="text-muted mb-0">${escapar(a.texto)}</p>
        </div>
      </a>
    </div>`).join('');
}
