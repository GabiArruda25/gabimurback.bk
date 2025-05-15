// Chave do armazenamento
const CHAVE_PRODUTOS = 'produtosBK';

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  document.getElementById('formProduto').addEventListener('submit', salvarProduto);
  document.getElementById('busca').addEventListener('input', buscarProdutos);
});

// Carrega produtos da memória e exibe na tabela
function carregarProdutos(filtro = '') {
  const lista = document.getElementById('listaProdutos');
  lista.innerHTML = '';

  const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];

  produtos
    .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((produto, index) => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td><img src="${produto.imagem}" alt="${produto.nome}" height="50"></td>
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>
          <button onclick="editarProduto(${index})">✏️</button>
          <button onclick="excluirProduto(${index})">🗑️</button>
        </td>
      `;

      lista.appendChild(linha);
    });
}

// Adiciona ou atualiza produto
function salvarProduto(evento) {
  evento.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const imagemInput = document.getElementById('imagem');
  const index = document.getElementById('indice').value;

  if (!nome || isNaN(preco) || preco <= 0 || imagemInput.files.length === 0) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const novaImagem = reader.result;
    const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];

    const produto = { nome, preco, imagem: novaImagem };

    if (index === '') {
      produtos.push(produto);
    } else {
      produtos[index] = produto;
    }

    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
    evento.target.reset();
    document.getElementById('indice').value = '';
    carregarProdutos();
  };

  reader.readAsDataURL(imagemInput.files[0]);
}

// Editar produto
function editarProduto(index) {
  const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];
  const produto = produtos[index];

  document.getElementById('nome').value = produto.nome;
  document.getElementById('preco').value = produto.preco;
  document.getElementById('indice').value = index;
  alert('Imagem precisa ser reenviada ao salvar.');
}

// Excluir produto
function excluirProduto(index) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  const produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];
  produtos.splice(index, 1);
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
  carregarProdutos();
}

// Buscar produtos
function buscarProdutos() {
  const termo = document.getElementById('busca').value.trim();
  carregarProdutos(termo);
}
