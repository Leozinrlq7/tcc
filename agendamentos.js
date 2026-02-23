const lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
const container = document.getElementById("listaAgendamentos");

if(lista.length === 0){
    container.innerHTML = `
        <p style="text-align:center; opacity:0.7;">
            Você ainda não possui agendamentos.
        </p>
    `;
} else {
    lista.forEach((item, index) => {
        container.innerHTML += `
            <div class="card-agendamento">
                <div class="info-agendamento">
                    <h3>${item.prestador}</h3>
                    <p>Data: ${item.data} | Horário: ${item.hora}</p>
                </div>
                <button class="btn-cancelar" onclick="cancelar(${index})">
                    Cancelar
                </button>
            </div>
        `;
    });
}

function cancelar(index){
    let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    lista.splice(index, 1);
    localStorage.setItem("agendamentos", JSON.stringify(lista));
    location.reload();
}