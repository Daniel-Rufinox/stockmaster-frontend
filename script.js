function mostrarMensagem(tela) {
    alert("Abrindo: " + tela);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("totalProdutos").textContent = "24";
    document.getElementById("estoqueBaixo").textContent = "5";
    document.getElementById("totalAlertas").textContent = "3";
});
