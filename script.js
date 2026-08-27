// ===============================
// BANCO DE DADOS LOCAL
// ===============================

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// ===============================
// SALVAR PRODUTOS
// ===============================

function salvarProdutos() {
localStorage.setItem("produtos", JSON.stringify(produtos));
}

// ===============================
// CADASTRO DE PRODUTOS
// ===============================

function cadastrarProduto() {

const nome = document.getElementById("nomeProduto").value.trim();
const categoria = document.getElementById("categoriaProduto").value.trim();
const quantidade = Number(document.getElementById("quantidadeProduto").value);
const estoqueMinimo = Number(document.getElementById("estoqueMinimo").value);
const validade = document.getElementById("validadeProduto").value;

if (!nome || !categoria || isNaN(quantidade) || isNaN(estoqueMinimo)) {
    alert("Preencha todos os campos obrigatórios.");
    return;
}

const produto = {
    id: Date.now(),
    nome: nome,
    categoria: categoria,
    quantidade: quantidade,
    estoqueMinimo: estoqueMinimo,
    validade: validade
};

produtos.push(produto);

salvarProdutos();

alert("Produto cadastrado com sucesso!");

window.location.href = "inventario.html";

}

// ===============================
// INVENTÁRIO
// ===============================

function carregarInventario() {

const tabela = document.getElementById("tabelaProdutos");

if (!tabela) return;

tabela.innerHTML = "";

if (produtos.length === 0) {
    tabela.innerHTML = `
        <tr>
            <td colspan="6">Nenhum produto cadastrado.</td>
        </tr>
    `;
    return;
}

produtos.forEach(produto => {

    const estoqueBaixo =
        produto.quantidade <= produto.estoqueMinimo;

    const status = estoqueBaixo
        ? "Estoque baixo"
        : "Normal";

    tabela.innerHTML += `
        <tr>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.estoqueMinimo}</td>
            <td>${status}</td>
            <td>
                <button class="btn btn-primary"
                    onclick="editarProduto(${produto.id})">
                    ✏️ Editar
                </button>

                <button class="btn btn-secondary"
                    onclick="excluirProduto(${produto.id})">
                    🗑️ Excluir
                </button>
            </td>
        </tr>
    `;
});

}

// ===============================
// EDITAR PRODUTO
// ===============================

function editarProduto(id) {

const produto = produtos.find(p => p.id === id);

if (!produto) {
    alert("Produto não encontrado.");
    return;
}

document.getElementById("editarId").value = produto.id;
document.getElementById("editarNome").value = produto.nome;
document.getElementById("editarCategoria").value = produto.categoria;
document.getElementById("editarQuantidade").value = produto.quantidade;
document.getElementById("editarEstoqueMinimo").value = produto.estoqueMinimo;
document.getElementById("editarValidade").value = produto.validade || "";

const formulario = document.getElementById("formEdicao");

formulario.style.display = "block";

formulario.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

}

// ===============================
// SALVAR EDIÇÃO
// ===============================

function salvarEdicao() {

const id = Number(document.getElementById("editarId").value);

const nome = document.getElementById("editarNome").value.trim();
const categoria = document.getElementById("editarCategoria").value.trim();
const quantidade = Number(document.getElementById("editarQuantidade").value);
const estoqueMinimo = Number(document.getElementById("editarEstoqueMinimo").value);
const validade = document.getElementById("editarValidade").value;

if (!nome || !categoria || isNaN(quantidade) || isNaN(estoqueMinimo)) {
    alert("Preencha todos os campos obrigatórios.");
    return;
}

const produto = produtos.find(p => p.id === id);

if (!produto) {
    alert("Produto não encontrado.");
    return;
}

produto.nome = nome;
produto.categoria = categoria;
produto.quantidade = quantidade;
produto.estoqueMinimo = estoqueMinimo;
produto.validade = validade;

salvarProdutos();

alert("Produto alterado com sucesso!");

cancelarEdicao();

carregarInventario();

}

// ===============================
// CANCELAR EDIÇÃO
// ===============================

function cancelarEdicao() {

const formulario = document.getElementById("formEdicao");

if (formulario) {
    formulario.style.display = "none";
}

}

// ===============================
// EXCLUIR PRODUTO
// ===============================

function excluirProduto(id) {

const produto = produtos.find(p => p.id === id);

if (!produto) {
    alert("Produto não encontrado.");
    return;
}

const confirmar = confirm(
    `Deseja realmente excluir o produto "${produto.nome}"?`
);

if (!confirmar) {
    return;
}

produtos = produtos.filter(p => p.id !== id);

salvarProdutos();

alert("Produto excluído com sucesso!");

carregarInventario();

}

// ===============================
// PREENCHER PRODUTOS NOS SELECTS
// ===============================

function carregarSelectProdutos() {

const selectEntrada = document.getElementById("produtoEntrada");
const selectSaida = document.getElementById("produtoSaida");

if (selectEntrada) {

    selectEntrada.innerHTML =
        '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {

        selectEntrada.innerHTML += `
            <option value="${produto.id}">
                ${produto.nome}
            </option>
        `;
    });
}

if (selectSaida) {

    selectSaida.innerHTML =
        '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {

        selectSaida.innerHTML += `
            <option value="${produto.id}">
                ${produto.nome}
            </option>
        `;
    });
}

}

// ===============================
// ENTRADA DE ESTOQUE
// ===============================

function registrarEntrada() {

const id = Number(document.getElementById("produtoEntrada").value);

const quantidade =
    Number(document.getElementById("quantidadeEntrada").value);

if (!id || !quantidade || quantidade <= 0) {
    alert("Selecione um produto e informe uma quantidade válida.");
    return;
}

const produto = produtos.find(p => p.id === id);

if (!produto) {
    alert("Produto não encontrado.");
    return;
}

produto.quantidade += quantidade;

salvarProdutos();

alert("Entrada registrada com sucesso!");

window.location.href = "inventario.html";

}

// ===============================
// SAÍDA DE ESTOQUE
// ===============================

function registrarSaida() {

const id = Number(document.getElementById("produtoSaida").value);

const quantidade =
    Number(document.getElementById("quantidadeSaida").value);

if (!id || !quantidade || quantidade <= 0) {
    alert("Selecione um produto e informe uma quantidade válida.");
    return;
}

const produto = produtos.find(p => p.id === id);

if (!produto) {
    alert("Produto não encontrado.");
    return;
}

if (quantidade > produto.quantidade) {
    alert("Quantidade de saída maior que o estoque disponível.");
    return;
}

produto.quantidade -= quantidade;

salvarProdutos();

alert("Saída registrada com sucesso!");

window.location.href = "inventario.html";

}

// ===============================
// ALERTAS
// ===============================

function carregarAlertas() {

const lista = document.getElementById("listaAlertas");

if (!lista) return;

lista.innerHTML = "";

let quantidadeAlertas = 0;

produtos.forEach(produto => {

    if (produto.quantidade <= produto.estoqueMinimo) {

        lista.innerHTML += `
            <div class="alerta">
                ⚠️ <strong>Estoque baixo:</strong>
                ${produto.nome} possui apenas
                ${produto.quantidade} unidade(s).
            </div>
        `;

        quantidadeAlertas++;
    }

    if (produto.validade) {

        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        const dataValidade =
            new Date(produto.validade + "T00:00:00");

        const diferenca =
            dataValidade.getTime() - hoje.getTime();

        const dias =
            Math.ceil(
                diferenca /
                (1000 * 60 * 60 * 24)
            );

        if (dias < 0) {

            lista.innerHTML += `
                <div class="alerta">
                    ❌ <strong>Produto vencido:</strong>
                    ${produto.nome}.
                </div>
            `;

            quantidadeAlertas++;

        } else if (dias <= 30) {

            lista.innerHTML += `
                <div class="alerta">
                    ⏰ <strong>Validade próxima:</strong>
                    ${produto.nome} vence em ${dias} dia(s).
                </div>
            `;

            quantidadeAlertas++;
        }
    }
});

if (quantidadeAlertas === 0) {

    lista.innerHTML = `
        <p>Nenhum alerta de estoque no momento.</p>
    `;
}

}

// ===============================
// DASHBOARD
// ===============================

function carregarDashboard() {

const totalProdutos =
    document.getElementById("totalProdutos");

const estoqueBaixo =
    document.getElementById("estoqueBaixo");

const totalAlertas =
    document.getElementById("totalAlertas");

if (totalProdutos) {
    totalProdutos.textContent = produtos.length;
}

if (estoqueBaixo) {

    const baixo = produtos.filter(
        produto =>
            produto.quantidade <= produto.estoqueMinimo
    ).length;

    estoqueBaixo.textContent = baixo;
}

if (totalAlertas) {

    let alertas = 0;

    produtos.forEach(produto => {

        if (produto.quantidade <= produto.estoqueMinimo) {
            alertas++;
        }

        if (produto.validade) {

            const hoje = new Date();

            hoje.setHours(0, 0, 0, 0);

            const validade =
                new Date(produto.validade + "T00:00:00");

            const dias =
                Math.ceil(
                    (validade - hoje) /
                    (1000 * 60 * 60 * 24)
                );

            if (dias <= 30) {
                alertas++;
            }
        }
    });

    totalAlertas.textContent = alertas;
}

}

// ===============================
// EXECUTAR AO ABRIR AS PÁGINAS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

carregarDashboard();
carregarInventario();
carregarSelectProdutos();
carregarAlertas();

});