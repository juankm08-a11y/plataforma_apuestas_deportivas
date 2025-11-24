
const WS_URL = "ws://localhost:3001";  
const API_URL = "http://localhost:3000"; 

let socket = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada, conectando WebSocket a ws://localhost:3001...");

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("WebSocket conectado al match_simulator");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.status === "OPEN") {
                addOpenMatch(data);
            } else if (data.status === "CLOSED") {
                moveToClosed(data);
            }
        } catch (e) {
            console.log("Mensaje no JSON recibido:", event.data);
        }
    };

    socket.onclose = () => console.log("WebSocket cerrado");
    socket.onerror = (err) => console.error("Error en WebSocket:", err);
});

function addOpenMatch(data) {
    if (document.getElementById(data.match_id)) return;

    const card = document.createElement('div');
    card.className = 'match-card open';
    card.id = data.match_id;

    card.innerHTML = `
        <div class="match-id">ID: ${data.match_id}</div>
        <div class="teams">
            <span class="team-home">${data.teams[0]}</span>
            <span class="vs">VS</span>
            <span class="team-away">${data.teams[1]}</span>
        </div>
        <p class="timer">¡Tienes 60 segundos para apostar!</p>
        <div class="bet-buttons">
            <button class="btn-bet home" data-match="${data.match_id}" data-team="${data.teams[0]}">
                $500 → ${data.teams[0]}
            </button>
            <button class="btn-bet away" data-match="${data.match_id}" data-team="${data.teams[1]}">
                $500 → ${data.teams[1]}
            </button>
        </div>
    `;

    card.querySelectorAll('.btn-bet').forEach(btn => {
        btn.addEventListener('click', () => {
            const matchId = btn.dataset.match;
            const team = btn.dataset.team;
            placeBet(matchId, team);
        });
    });

    document.getElementById('open-matches').prepend(card);
}

function moveToClosed(data) {
    const openCard = document.getElementById(data.match_id);
    if (openCard) openCard.remove();

    let closedCard = document.getElementById('closed-' + data.match_id);
    if (!closedCard) {
        closedCard = document.createElement('div');
        closedCard.className = 'match-card closed';
        closedCard.id = 'closed-' + data.match_id;
        document.getElementById('closed-matches').prepend(closedCard);
    }

    closedCard.innerHTML = `
        <div class="match-id">ID: ${data.match_id}</div>
        <div class="teams">${data.teams[0]} <span class="vs">VS</span> ${data.teams[1]}</div>
        <div class="result">GANADOR: <strong style="color:gold;">${data.winner}</strong></div>
        <p style="color:#0f0; font-size:0.9em;">Email enviado</p>
    `;
}

async function placeBet(match_id, team) {
    try {
       const response =  await fetch(`${API_URL}/bet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: "juancarlospabon01@gmail.com",
                match_id, 
                bet_on: team, 
                amount: 500
            })
        });

        if (response.ok) {
            alert(`¡Apuesta de ${500} a ${team} registrada con exito`);
        } else {
            alert("Error al registrar apuesta");
        }
    } catch (err) {
        alert("Apuesta enviada (simulada)");
    }
}