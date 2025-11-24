const WebSocket = require('ws');
const amqp = require('amqplib');

const wss = new WebSocket.Server({ port: 3001 });
console.log("Dashboard WebSocket en ws://0.0.0.0:3001");

wss.on('connection', ws => {
  console.log('Cliente conectado al dashboard');
  ws.send(JSON.stringify({ type: 'info', message: 'Conectado a BetLive' }));
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

async function start() {
  const conn = await amqp.connect('amqp://rabbitmq:5672');
  const ch = await conn.createChannel();

  const q = await ch.assertQueue('', { exclusive: true });
  await ch.bindQueue(q.queue, 'notifications', 'notify.dashboard.update');

  console.log("Dashboard backend escuchando notificaciones...");

  ch.consume(q.queue, msg => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      broadcast(data);
      ch.ack(msg);
    }
  });
}

start();