let produtos = JSON.parse(localStorage.getItem("stockmaster_produtos")) || [];

function salvarProdutos() {
    localStorage.setItem("stockmaster_produtos", JSON.stringify(produtos));
}

function atualizarDashboard() {
    const totalProdutos = document.getElementById("totalProdutos");
    const estoqueBaixo = document.getElementById("estoqueBaixo");
    const totalAlertas = document.getElementById("totalAlertas");

    if (totalProdutos) {
        totalProdutos.textContent = produtos.length;
    }

    if (estoqueBaixo) {
        estoqueBaixo.textContent = produtos.filter(
            produto => produto.quantidade <= produto.minimo
        ).length;
    }

    if (totalAlertas) {
        totalAlertas.textContent = produtos.filter(
            produto => produto.quantidade <= produto.minimo
        ).length;
    }
}

function cadastrarProduto() {
    const nome = document.getElementById("nomeProduto").value.trim();
    const categoria = document.getElementById("categoriaProduto").value.trim();
    const quantidade = Number(document.getElementById("quantidadeProduto").value);
    const minimo = Number(document.getElementById("estoqueMinimo").value);

    if (!nome || !categoria || quantidade < 0 || minimo < 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const novoProduto = {
        id: Date.now(),
        nome: nome,
        categoria: categoria,
        quantidade: quantidade,
        minimo: minimo
    };

    produtos.push(novoProduto);
    salvarProdutos();

    alert("Produto cadastrado com sucesso!");

    window.location.href = "inventario.html";
}

function registrarEntrada() {
    const produtoId = Number(document.getElementById("produtoEntrada").value);
    const quantidade = Number(document.getElementById("quantidadeEntrada").value);

    const produto = produtos.find(p => p.id === produtoId);

    if (!produto || quantidade <= 0) {
        alert("Selecione um produto e informe uma quantidade válida.");
        return;
    }

    produto.quantidade += quantidade;

    salvarProdutos();

    alert("Entrada de estoque registrada com sucesso!");

    window.location.href = "inventario.html";
}

function registrarSaida() {
    const produtoId = Number(document.getElementById("produtoSaida").value);
    const quantidade = Number(document.getElementById("quantidadeSaida").value);

    const produto = produtos.find(p => p.id === produtoId);

    if (!produto || quantidade <= 0) {
        alert("Selecione um produto e informe uma quantidade válida.");
        return;
    }

    if (quantidade > produto.quantidade) {
        alert("A quantidade de saída não pode ser maior que o estoque disponível.");
        return;
    }

    produto.quantidade -= quantidade;

    salvarProdutos();

    alert("Saída de estoque registrada com sucesso!");

    window.location.href = "inventario.html";
}

function carregarProdutosSelect(idSelect) {
    const select = document.getElementById(idSelect);

    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const option = document.createElement("option");

        option.value = produto.id;
        option.textContent = `${produto.nome} - Estoque: ${produto.quantidade}`;

        select.appendChild(option);
    });
}

function carregarInventario() {
    const tabela = document.getElementById("tabelaProdutos");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (produtos.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5">Nenhum produto cadastrado.</td>
            </tr>
        `;
        return;
    }

    produtos.forEach(produto => {
        const status =
            produto.quantidade <= produto.minimo
                ? "Estoque baixo"
                : "Normal";

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.minimo}</td>
            <td>${status}</td>
        `;

        tabela.appendChild(linha);
    });
}

function carregarAlertas() {
    const lista = document.getElementById("listaAlertas");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    const produtosBaixos = produtos.filter(
        produto => produto.quantidade <= produto.minimo
    );

    if (produtosBaixos.length === 0) {
        lista.innerHTML = `
            <div class="alert">
                Nenhum alerta de estoque no momento.
            </div>
        `;
        return;
    }

    produtosBaixos.forEach(produto => {
        const alerta = document.createElement("div");

        alerta.className = "alert";

        alerta.innerHTML = `
            <strong>Estoque baixo:</strong>
            ${produto.nome} possui apenas ${produto.quantidade} unidade(s).
            Estoque mínimo: ${produto.minimo}.
        `;

        lista.appendChild(alerta);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    atualizarDashboard();
    carregarProdutosSelect("produtoEntrada");
    carregarProdutosSelect("produtoSaida");
    carregarInventario();
    carregarAlertas();
});