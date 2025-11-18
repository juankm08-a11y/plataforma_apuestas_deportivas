const ws = new WebSocket(`ws://${window.location.hostname}:8082`);

ws.onmessage = (event) => {
  const div = document.getElementById("alerts");
  const p = document.createElement("p");
  p.textContent = event.data;
  div.appendChild(p);
};

ws.onopen = () => {
  console.log("Conectado a websocket");
};

ws.onerror = (err) => {
  console.error("Error en WebSocket:", err);
};
