const ws = new WebSocket("ws://localhost:8082");

ws.onmessage = (event) => {
  const div = document.getElementById("alerts");
  const p = document.createElement("p");
  p.textContent = event.data;
  div.appendChild(p);
};
