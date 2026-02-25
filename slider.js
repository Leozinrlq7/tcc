// ===== SLIDER DAS IMAGENS =====
document.querySelectorAll(".slider").forEach(slider => {
    const images = slider.querySelectorAll(":scope > img");
    const prev = slider.querySelector(".arrow.left");
    const next = slider.querySelector(".arrow.right");

    let index = 0;

    function showImage(i) {
        images.forEach(img => img.classList.remove("active"));
        images[i].classList.add("active");
    }

    next.addEventListener("click", () => {
        index = (index + 1) % images.length;
        showImage(index);
    });

    prev.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        showImage(index);
    });
});

// ===== BOTÕES =====
document.getElementById("btnInicio").addEventListener("click", e=>{
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("btnAgendamentos").addEventListener("click", e=>{
    e.preventDefault();
    window.location.href = "agendamentos.html";
});

document.getElementById("btnPesquisar").addEventListener("click", e=>{
    e.preventDefault();
    let termo = prompt("Digite o nome do estabelecimento:");
    if(!termo) return;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const nome = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = nome.includes(termo.toLowerCase()) ? "block" : "none";
    });
});

// ===== BOTÃO AGENDAR =====
document.querySelectorAll(".btn").forEach(botao => {
    botao.addEventListener("click", function(){
        const card = this.closest(".card");
        const nome = card.querySelector("h3").textContent;

        // salva prestador no localStorage
        localStorage.setItem("prestadorSelecionado", nome);

        window.location.href = "agendar.html";
    });
});