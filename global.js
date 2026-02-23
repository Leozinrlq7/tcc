// ===== LOGO VOLTA PARA HOME =====
document.querySelectorAll(".logo").forEach(logo => {
    logo.style.cursor = "pointer";

    logo.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});

// ===== BOTÃO VOLTAR =====
const btnVoltar = document.getElementById("btnVoltar");

if(btnVoltar){
    btnVoltar.addEventListener("click", function(e){
        e.preventDefault();
        window.history.back();
    });
}