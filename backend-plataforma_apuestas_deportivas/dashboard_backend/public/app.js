const ws = new WebSocket(`wss://${window.location.hostname}:8081`);

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    const div = document.getElementById("alerts");
    div.innerHTML = "";

    const partidos = Array.isArray(data) ? data : [data];
    partidos.forEach((p) => {
      const pDiv = document.createElement("div");
      pDiv.classList.add("match");
      pDiv.innerHTML = `
        <h3>${p.match_id} - ${p.status || "ABIERTA"}</h3>
        ${p.winner ? `<p>Ganador: ${p.winner}</p>` : ""}
        ${
          p.odds
            ? `<p>Cuotas: ${Object.entries(p.odds)
                .map(([team, o]) => team + ": " + o)
                .join(" | ")}</p>`
            : ""
        }
      `;
      div.appendChild(pDiv);
    });
  } catch (err) {
    console.error("Error parseando mensaje WS:", err);
  }
};

ws.onopen = () => {
  console.log("Conectado a WebSocket seguro");
};

ws.onerror = (err) => {
  console.error("Error en WebSocket:", err);
};
