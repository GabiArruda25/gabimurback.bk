const USUARIOS_KEY = 'usuariosBK';
const LOGADO_KEY = 'usuarioLogado';

const form = document.getElementById('formLogin');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const msgErro = document.getElementById('msgErro');

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if(!usuario){
    msgErro.textContent = 'Email ou senha incorretos.';
    return;
  }

  localStorage.setItem(LOGADO_KEY, JSON.stringify(usuario));

  if(usuario.tipo === 'gerente'){
    window.location.href = '../gerente/gerente.html';
  } else {
    window.location.href = '../principal/index.html';
  }
});
