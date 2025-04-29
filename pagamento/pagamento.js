window.onload = function () {
  const totalOriginal = parseFloat(localStorage.getItem("total")) || 0;
  const cupomDigitado = localStorage.getItem("cupom") || "";

  const cuponsValidos = {
    DESCONTO10: 0.10,
    BK2025: 0.15,
    FURIA15: 0.15,
    SUPER5: 0.05
  };

  let desconto = 0;
  if (cuponsValidos[cupomDigitado]) {
    desconto = cuponsValidos[cupomDigitado];
  }

  const valorComDesconto = totalOriginal * (1 - desconto);
  document.getElementById("valorFinal").textContent = `R$ ${valorComDesconto.toFixed(2)}`;
  document.getElementById("valorTotal").textContent = `Total: R$ ${valorComDesconto.toFixed(2)}`;

  localStorage.setItem("valorFinal", valorComDesconto.toFixed(2));
};

function selecionarPagamento(tipo) {
  const pixArea = document.getElementById("pix-area");

  if (tipo === "pix") {
    pixArea.style.display = "block";

    const chavePix = "13885897962"; // CPF
    const nome = "Gabriela Murback";
    const cidade = "SAO PAULO";
    const valor = parseFloat(localStorage.getItem("valorFinal")) || 0;

    const payload = gerarPayloadPix({
      chave: chavePix,
      nome,
      cidade,
      valor
    });

    QRCode.toCanvas(document.getElementById("qrcode"), payload, function (error) {
      if (error) console.error(error);
    });
  } else {
    pixArea.style.display = "none";
    alert("Pagamento com cartão selecionado!");
  }
}

document.getElementById("voltar-cupom").addEventListener("click", function () {
  window.location.href = "../cupom/cupom.html";
});

function gerarPayloadPix({ chave, nome, cidade, valor }) {
  const valorFormatado = valor.toFixed(2);
  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, "0")}${chave}`;
  const merchantInfoLength = merchantAccountInfo.length.toString().padStart(2, "0");

  const payload = [
    "000201", // Payload Format Indicator
    `26${merchantInfoLength}${merchantAccountInfo}`, // Merchant Account Info
    "52040000", // Merchant Category Code
    "5303986", // Transaction Currency (BRL)
    `54${valorFormatado.length.toString().padStart(2, "0")}${valorFormatado}`, // Transaction Amount
    "5802BR", // Country Code
    `59${nome.length.toString().padStart(2, "0")}${nome}`, // Merchant Name
    `60${cidade.length.toString().padStart(2, "0")}${cidade}`, // Merchant City
    "62070503***", // Additional Data Field Template (random txid)
    "6304" // CRC placeholder
  ];

  const payloadCompleto = payload.join("");
  const crc = gerarCRC16(payloadCompleto);
  return payloadCompleto + crc;
}

function gerarCRC16(str) {
  let polinomio = 0x1021;
  let resultado = 0xFFFF;

  for (let i = 0; i < str.length; i++) {
    resultado ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((resultado & 0x8000) !== 0) {
        resultado = (resultado << 1) ^ polinomio;
      } else {
        resultado <<= 1;
      }
      resultado &= 0xFFFF;
    }
  }

  return resultado.toString(16).toUpperCase().padStart(4, "0");
}
