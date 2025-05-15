const USUARIOS_KEY = 'usuariosBK';
const TOKENS_KEY = 'tokensRecuperacao';

const form = document.getElementById('formEsqueci');
const emailInput = document.getElementById('email');
const msg = document.getElementById('msg');

function gerarToken(){
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();

  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
  if(!usuarios.some(u => u.email === email)){
    msg.textContent = 'Email não cadastrado.';
    msg.style.color = 'red';
    return;
  }

  const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY)) || {};

  const token = gerarToken();
  const expiracao = Date.now() + (10 * 60 * 1000); // 10 minutos

  tokens[email] = { token, expiracao };
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

  alert(`Seu token de recuperação é: ${token} (válido por 10 minutos)`);

  msg.textContent = 'Token enviado! Verifique seu email (simulado).';
  msg.style.color = 'green';

  // Poderia redirecionar para redefinir senha:
  setTimeout(() => {
    window.location.href = '../redefinir_senha/redefinir.html?email=' + encodeURIComponent(email);
  }, 2000);
});
