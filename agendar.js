// ===== GUARDA: LOGIN OBRIGATÓRIO PARA AGENDAR =====
(function requireLoginForScheduling(){
  const mode = localStorage.getItem("authMode");
  if(mode !== "user"){
    sessionStorage.setItem("loginNotice", "É necessário fazer login para agendar.");
    window.location.href = "login.html#login";
  }
})();

// ===== ELEMENTOS =====
const prestadorNomeEl = document.getElementById("prestadorNome");
const dataInput = document.getElementById("data");
const horaSelect = document.getElementById("hora");
const confirmarBtn = document.getElementById("confirmar");

// ===== LISTA DE PRESTADORES COM HORÁRIOS =====
const prestadores = [
  { nome: "Manxinha do Corte", horarios: ["09:00","10:00","11:00","14:00","15:00"] },
  { nome: "Rufino Barbeiro", horarios: ["09:00","11:00","13:00","15:00"] },
  { nome: "Pedrão do Corte", horarios: ["10:00","11:00","14:00","16:00"] },
  { nome: "Espaço Glamour", horarios: ["09:00","12:00","15:00"] },
  { nome: "Studio Bella", horarios: ["10:00","11:00","14:00","16:00"] },
  { nome: "Studio Luna", horarios: ["09:00","11:00","13:00","15:00"] },
  { nome: "Estúdio Dudu", horarios: ["10:00","12:00","14:00"] },
  { nome: "Gustavo Barbeiro", horarios: ["09:00","11:00","14:00","16:00"] },
  { nome: "Bella Vita", horarios: ["09:00","10:00","12:00","14:00"] },
  { nome: "Enrique Hghbarber", horarios: ["09:00","11:00","13:00","15:00"] },
  { nome: "Hg Tattoo", horarios: ["10:00","12:00","14:00"] },
  { nome: "Essence Spa", horarios: ["09:00","11:00","13:00","15:00"] }
];

// ===== PRESTADOR SELECIONADO =====
const prestadorSelecionado = localStorage.getItem("prestadorSelecionado");
if(!prestadorSelecionado){
    alert("Nenhum prestador selecionado!");
    window.location.href = "index.html";
}
prestadorNomeEl.textContent = prestadorSelecionado;

// ===== RESTRIÇÃO DE DATAS =====
const hoje = new Date();
const hojeStr = hoje.toISOString().split("T")[0];
dataInput.value = hojeStr;      // pré-preenche com hoje
dataInput.min = hojeStr;        // impede datas passadas

const maxData = new Date();
maxData.setDate(maxData.getDate() + 30); // 30 dias no futuro
dataInput.max = maxData.toISOString().split("T")[0]; 

// ===== FUNÇÃO PARA ATUALIZAR HORÁRIOS DISPONÍVEIS =====
function atualizarHorarios() {
    const prestador = prestadores.find(p => p.nome === prestadorSelecionado);
    if(!prestador) return;

    let horarios = [...prestador.horarios];

    // Se for hoje, remove horários passados
    const dataEscolhida = new Date(dataInput.value);
    if(dataEscolhida.toDateString() === hoje.toDateString()){
        const horaAtual = hoje.getHours();
        horarios = horarios.filter(h => parseInt(h.split(":")[0]) > horaAtual);
    }

    // Remove horários já agendados
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const horariosOcupados = agendamentos
        .filter(a => a.prestador === prestadorSelecionado && a.data === dataInput.value)
        .map(a => a.hora);

    horarios = horarios.filter(h => !horariosOcupados.includes(h));

    // Preenche o select de horários
    horaSelect.innerHTML = "";
    if(horarios.length === 0){
        horaSelect.innerHTML = "<option>Nenhum horário disponível</option>";
    } else {
        horarios.forEach(h => horaSelect.innerHTML += `<option value="${h}">${h}</option>`);
    }
}

// Atualiza horários quando muda a data
dataInput.addEventListener("change", atualizarHorarios);
window.addEventListener("load", atualizarHorarios);

// ===== CONFIRMAR AGENDAMENTO =====
confirmarBtn.addEventListener("click", () => {
    const mode = localStorage.getItem("authMode");
    if(mode !== "user"){
        sessionStorage.setItem("loginNotice", "É necessário fazer login para agendar.");
        window.location.href = "login.html#login";
        return;
    }
    const hora = horaSelect.value;
    if(!hora || hora === "Nenhum horário disponível"){
        window.uiToast?.("Selecione um horário válido.");
        return;
    }

    const lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    lista.push({ prestador: prestadorSelecionado, data: dataInput.value, hora });
    localStorage.setItem("agendamentos", JSON.stringify(lista));

    window.uiToast?.("Agendamento confirmado ✅");
    window.location.href = "agendamentos.html";
});