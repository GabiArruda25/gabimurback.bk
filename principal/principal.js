const produtosPorCategoria = {
  lanches: [
    { nome: 'Whopper', preco: 42.50, img: '../img/Whopper.jpg' },
    { nome: 'Big King', preco: 40.00, img: '../img/BigKing.jpg' },
    { nome: 'Chicken Duplo', preco: 37.50, img: '../img/ChickenDuplo.jpg' },
    { nome: 'Stacker Duplo Bacon', preco: 40.00, img: '../img/StackerDuploBacon.jpg' },
    { nome: 'Mega Stacker 2.0', preco: 55.00, img: '../img/MegaStacker2.0.jpg' },
    { nome: 'Mega Stacker 3.0', preco: 65.00, img: '../img/MegaStacker3.0.jpg' },
    { nome: 'Whopper Rodeio', preco: 52.50, img: '../img/WhopperRodeio.jpg' },
    { nome: 'Whopper Duplo', preco: 55.00, img: '../img/WhopperDuplo.jpg' },
    { nome: 'Whopper Barbecue Bacon', preco: 52.50, img: '../img/WhopperBarbecueBacon.jpg' },
    { nome: 'Whopper Furioso', preco: 52.50, img: '../img/WhopperFurioso.jpg' },
    { nome: 'Whopper Vegetariano', preco: 42.50, img: '../img/WhopperVegetariano.jpg' }
  ],
  snacks: [
    { nome: 'Batata Média', preco: 18.75, img: '../img/BatataMedia.jpg' },
    { nome: 'Bk Chicken', preco: 19.00, img: '../img/BkChicken.jpg' },
    { nome: 'Balde de Batata Frita', preco: 33.75, img: '../img/BaldedeBatata.jpg' }
  ]
};

let carrinho = [];

function mostrarCategoria(categoria) {
  const areaProdutos = document.getElementById('produtos');
  areaProdutos.innerHTML = '';

  produtosPorCategoria[categoria].forEach((produto, index) => {
    const existente = carrinho.find(item => item.nome === produto.nome);
    const quantidade = existente ? existente.quantidade : 0;

    const div = document.createElement('div');
    div.classList.add('produto');
    div.innerHTML = `
      <img src="${produto.img}" alt="${produto.nome}">
      <h4>${produto.nome}</h4>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <div class="quantidade">
        <button onclick="alterarQuantidade('${categoria}', ${index}, -1)">-</button>
        <span id="qtd-${categoria}-${index}">${quantidade}</span>
        <button onclick="alterarQuantidade('${categoria}', ${index}, 1)">+</button>
      </div>
    `;
    areaProdutos.appendChild(div);
  });
}



function alterarQuantidade(categoria, index, delta) {
  const id = `${categoria}-${index}`;
  const span = document.getElementById(`qtd-${id}`);
  let qtd = parseInt(span.textContent) + delta;
  if (qtd < 0) qtd = 0;
  span.textContent = qtd;

  const produto = produtosPorCategoria[categoria][index];
  const existente = carrinho.find(item => item.nome === produto.nome);

  if (existente) {
    if (qtd === 0) {
      carrinho = carrinho.filter(item => item.nome !== produto.nome);
    } else {
      existente.quantidade = qtd;
    }
  } else if (qtd > 0) {
    carrinho.push({ ...produto, quantidade: qtd });
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const itensCarrinho = document.getElementById("itensCarrinho");
  const listaCarrinho = document.getElementById("lista-carrinho");
  itensCarrinho.innerHTML = "";
  listaCarrinho.innerHTML = "";

  carrinho.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item-carrinho");
    div.innerHTML = `
      <span>${item.nome}</span>
      <span>Qtd: ${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
    `;
    listaCarrinho.appendChild(div);
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  document.getElementById("total").textContent = total.toFixed(2);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  localStorage.setItem("total", total.toFixed(2));
}

function irParaCupom() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  localStorage.setItem("total", document.getElementById("total").textContent);
  window.location.href = "../cupom/cupom.html";
}

window.onload = function () {
  const carrinhoArmazenado = localStorage.getItem("carrinho");
  if (carrinhoArmazenado) {
    carrinho = JSON.parse(carrinhoArmazenado);
  }

  atualizarCarrinho();
  
  const totalCarrinho = localStorage.getItem('total');
  if (totalCarrinho) {
    document.getElementById('total').textContent = parseFloat(totalCarrinho).toFixed(2);
  }

  mostrarCategoria("lanches"); // ou a categoria padrão que quiser mostrar ao abrir
};
