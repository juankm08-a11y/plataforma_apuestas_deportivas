const ws = new WebSocket(`wss://${window.location.hostname}:8081`);

ws.onmessage = (event) => {
  const div = document.getElementById("alerts");
  const p = document.createElement("p");
  p.textContent = event.data;
  div.appendChild(p);
};

ws.onopen = () => {
  console.log("Conectado a WebSocket seguro");
};

ws.onerror = (err) => {
  console.error("Error en WebSocket:", err);
};
