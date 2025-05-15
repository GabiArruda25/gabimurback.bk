const USUARIOS_KEY = 'usuariosBK';

const form = document.getElementById('formCadastro');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const tipoSelect = document.getElementById('tipo');
const msgErro = document.getElementById('msgErro');

function senhaForte(senha) {
  return senha.length >= 6;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const tipo = tipoSelect.value;

  if(!senhaForte(senha)){
    msgErro.textContent = 'Senha fraca. Use pelo menos 6 caracteres.';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
  if(usuarios.some(u => u.email === email)){
    msgErro.textContent = 'Email já cadastrado.';
    return;
  }

  usuarios.push({email, senha, tipo});
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  alert('Cadastro realizado com sucesso!');
  window.location.href = '../login/login.html';
});
