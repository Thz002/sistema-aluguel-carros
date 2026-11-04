import { SessaoService } from '../services/SessaoService.js';

if (SessaoService.obter()) window.location.href = 'index.html';

const form = document.getElementById('formLogin');
const campoSenha = document.getElementById('senha');
const btnMostrarSenha = document.getElementById('btnMostrarSenha');
const mensagem = document.getElementById('mensagemLogin');

function mostrarMensagem(texto, erro = false) {
  mensagem.classList.toggle('security-note--erro', erro);
  mensagem.querySelector('i').className = erro ? 'bi bi-exclamation-circle' : 'bi bi-lock';
  mensagem.querySelector('span').textContent = texto;
}

btnMostrarSenha.addEventListener('click', () => {
  const visivel = campoSenha.type === 'password';
  campoSenha.type = visivel ? 'text' : 'password';
  btnMostrarSenha.querySelector('i').className = visivel ? 'bi bi-eye-slash' : 'bi bi-eye';
  btnMostrarSenha.setAttribute('aria-pressed', visivel);
  btnMostrarSenha.setAttribute('aria-label', visivel ? 'Ocultar senha' : 'Mostrar senha');
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const login = form.elements.login.value.trim();
  const senha = form.elements.senha.value;
  const lembrar = document.getElementById('lembrar').checked;

  if (!login || !senha) {
    mostrarMensagem('Informe login e senha.', true);
    return;
  }

  try {
    const usuario = await SessaoService.autenticar(login, senha, lembrar);
    if (!usuario) {
      mostrarMensagem('Login ou senha inválidos.', true);
      return;
    }
    window.location.href = 'index.html';
  } catch {
    mostrarMensagem('Não foi possível conectar ao servidor. Verifique se o JSON Server está rodando.', true);
  }
});
