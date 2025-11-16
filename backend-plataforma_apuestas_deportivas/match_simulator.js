const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "match-simulator",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const RABBITMQ_URL = "amqp://guest:guest@rabbitmq";

async function run() {
  await producer.connect();

  const connection = amqp.createConnection({ url: RABBITMQ_URL });

  connection.on("ready", () => {
    console.log("Connectado a RabbitMQ");

    connection.queue("match_simulator_queue", { durable: true }, (queue) => {
      queue.bind("match_exchange", "match_simulator");
      console.log("Esperando mensajes...");

      queue.subscribe(async (message) => {
        const data = JSON.parse(message.data.toString());

        const winner = Math.random() > 0.5 ? "Team A" : "Team B";

        const event = {
          event_type: "MATCH_FINISHED",
          match_id: data.match_id,
          winner,
        };

        console.log(`Termina partido ${data.match_id} =>  Ganador: ${winner} `);

        await producer.send({
          topic: "match_events",
          messages: [{ key: parsed.match_id, value: JSON.stringify(event) }],
        });
      });
    });
  });

  connection.on("error", (err) => {
    console.error(`Error en RabbitMQ: ${err}`);
  });
}

run().catch(console.error);
