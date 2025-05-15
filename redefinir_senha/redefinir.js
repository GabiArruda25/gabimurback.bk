const USUARIOS_KEY = 'usuariosBK';
const TOKENS_KEY = 'tokensRecuperacao';

// Obtém o email da URL (ex: ?email=teste@email.com)
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

const form = document.getElementById('formRedefinir');
const tokenInput = document.getElementById('token');
const novaSenhaInput = document.getElementById('novaSenha');
const msg = document.getElementById('msg');

// Função para verificar força da senha
function senhaForte(senha) {
  return senha.length >= 6;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const tokenDigitado = tokenInput.value.trim();
  const novaSenha = novaSenhaInput.value.trim();

  if (!senhaForte(novaSenha)) {
    msg.textContent = 'Senha fraca. Use pelo menos 6 caracteres.';
    msg.style.color = 'red';
    return;
  }

  const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY)) || {};
  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

  const dadosToken = tokens[email];
  if (!dadosToken) {
    msg.textContent = 'Nenhum token encontrado para este email.';
    msg.style.color = 'red';
    return;
  }

  if (dadosToken.token !== tokenDigitado) {
    msg.textContent = 'Token incorreto.';
    msg.style.color = 'red';
    return;
  }

  if (Date.now() > dadosToken.expiracao) {
    msg.textContent = 'Token expirado. Solicite um novo.';
    msg.style.color = 'red';
    return;
  }

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    msg.textContent = 'Usuário não encontrado.';
    msg.style.color = 'red';
    return;
  }

  if (usuario.senha === novaSenha) {
    msg.textContent = 'A nova senha não pode ser igual à antiga.';
    msg.style.color = 'red';
    return;
  }

  // Atualiza senha
  usuario.senha = novaSenha;
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

  // Remove o token usado
  delete tokens[email];
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

  alert('Senha redefinida com sucesso!');
  window.location.href = '../login/login.html';
});
