const amqp = require('amqplib');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const producer = kafka.producer();

async function main() {
  await producer.connect();

  const conn = await amqp.connect('amqp://rabbitmq:5672');
  const channel = await conn.createChannel();

  await channel.assertQueue('match_simulation_queue', { durable: true });

  console.log('Match Simulator listo - esperando partidos para cerrar...');

  channel.consume('match_simulation_queue', async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const match_id = data.matchId || data.match_id;

      if (!match_id) {
        console.log("Mensaje sin match_id:", data);
        channel.ack(msg);
        return;
      }

      const winner_index = Math.random() < 0.5 ? 0 : 1;

      const event = {
        event_type: "MATCH_FINISHED",
        match_id,
        winner_index,
        timestamp: new Date().toISOString()
      };

      await producer.send({
        topic: 'match_events',
        messages: [{ key: match_id, value: JSON.stringify(event) }]
      });

      console.log(`Partido FINALIZADO: ${match_id} → Ganador índice ${winner_index}`);
      channel.ack(msg);
    } catch (err) {
      console.error("Error en match_simulator:", err);
      channel.nack(msg, false, false);
    }
  });
}

main().catch(err => {
  console.error("Error fatal:", err);
  process.exit(1);
});