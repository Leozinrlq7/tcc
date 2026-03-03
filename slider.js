// ===== SLIDER DAS IMAGENS =====
document.querySelectorAll(".card-header, .slider").forEach(slider => {
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

    const topo = document.getElementById("pesquisaTopo");
    const input = document.getElementById("inputPesquisar");
    const btnFechar = document.getElementById("btnFecharPesquisar");

    if(!topo || !input || !btnFechar) return;

    const isHidden = topo.hasAttribute("hidden");
    if(isHidden){
        topo.removeAttribute("hidden");
        input.focus();
    }else{
        topo.setAttribute("hidden","");
        input.value = "";
        document.querySelectorAll(".card").forEach(card => card.style.display = "block");
        return;
    }

    function aplicarPesquisa(){
        const termo = (input.value || "").trim().toLowerCase();
        const cards = document.querySelectorAll(".card");
        if(!termo){
            cards.forEach(card => card.style.display = "block");
            return;
        }
        cards.forEach(card => {
            const nome = (card.querySelector("h3")?.textContent || "").toLowerCase();
            card.style.display = nome.includes(termo) ? "block" : "none";
        });
    }

    if(!input.dataset.bound){
        input.addEventListener("input", aplicarPesquisa);
        input.addEventListener("keydown", (ev)=>{
            if(ev.key === "Escape"){
                topo.setAttribute("hidden","");
                input.value = "";
                document.querySelectorAll(".card").forEach(card => card.style.display = "block");
            }
        });
        btnFechar.addEventListener("click", ()=>{
            topo.setAttribute("hidden","");
            input.value = "";
            document.querySelectorAll(".card").forEach(card => card.style.display = "block");
        });
        input.dataset.bound = "1";
    }

    aplicarPesquisa();
});


// ===== BOTÃO AGENDAR =====
document.querySelectorAll(".btn").forEach(botao => {
    botao.addEventListener("click", function(){
        const card = this.closest(".card");
        const nome = card.querySelector("h3").textContent;

        // bloqueia agendamento para guest
        const mode = localStorage.getItem("authMode");
        if(mode !== "user"){
            sessionStorage.setItem("loginNotice", "É necessário fazer login para agendar.");
            window.location.href = "login.html#login";
            return;
        }

        // salva prestador no localStorage
        localStorage.setItem("prestadorSelecionado", nome);

        window.location.href = "agendar.html";
    });
});

// ===== FILTRO POR CATEGORIA (HOME) =====
(function(){
    const btnFiltro = document.getElementById("btnFiltro");
    const painelFiltro = document.getElementById("painelFiltro");
    const selectCategoria = document.getElementById("selectCategoria");
    const btnAplicar = document.getElementById("btnAplicarFiltro");
    const btnLimpar = document.getElementById("btnLimparFiltro");

    // só roda na HOME
    if(!btnFiltro || !painelFiltro || !selectCategoria) return;

    function getCategoriasUnicas(){
        const set = new Set();
        document.querySelectorAll(".card .categoria").forEach(el => {
            const txt = (el.textContent || "").trim();
            if(txt) set.add(txt);
        });
        return Array.from(set).sort((a,b) => a.localeCompare(b, "pt-BR"));
    }

    function popularSelect(){
        const categorias = getCategoriasUnicas();
        const currentSaved = localStorage.getItem("filtroCategoria") || "__all__";

        selectCategoria.innerHTML = '<option value="__all__">Todas</option>';
        categorias.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            selectCategoria.appendChild(opt);
        });

        selectCategoria.value = categorias.includes(currentSaved) ? currentSaved : "__all__";
    }

    function aplicarFiltro(){
        const valor = selectCategoria.value;
        localStorage.setItem("filtroCategoria", valor);

        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            const catEl = card.querySelector(".categoria");
            const cat = (catEl?.textContent || "").trim();
            const mostrar = (valor === "__all__") ? true : (cat === valor);
            card.style.display = mostrar ? "block" : "none";
        });

        if(window.uiToast){
            window.uiToast(valor === "__all__" ? "Filtro removido." : `Filtrando: ${valor}`);
        }
    }

    function limparFiltro(){
        selectCategoria.value = "__all__";
        aplicarFiltro();
    }

    function abrirFecharPainel(){
        const isHidden = painelFiltro.hasAttribute("hidden");
        if(isHidden){
            popularSelect();
            painelFiltro.removeAttribute("hidden");
            btnFiltro.setAttribute("aria-expanded", "true");
        }else{
            painelFiltro.setAttribute("hidden", "");
            btnFiltro.setAttribute("aria-expanded", "false");
        }
    }

    btnFiltro.addEventListener("click", (e) => {
        e.preventDefault();
        abrirFecharPainel();
    });

    btnAplicar?.addEventListener("click", aplicarFiltro);
    btnLimpar?.addEventListener("click", limparFiltro);

    // aplicar filtro salvo ao carregar
    popularSelect();
    const saved = localStorage.getItem("filtroCategoria") || "__all__";
    if(saved !== "__all__"){
        aplicarFiltro();
    }

    // fecha painel ao clicar fora
    document.addEventListener("click", (ev) => {
        if(painelFiltro.hasAttribute("hidden")) return;
        const t = ev.target;
        if(btnFiltro.contains(t) || painelFiltro.contains(t)) return;
        painelFiltro.setAttribute("hidden", "");
        btnFiltro.setAttribute("aria-expanded", "false");
    });
})();
