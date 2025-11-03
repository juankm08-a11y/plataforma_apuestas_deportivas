const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "asistencia-producer",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const zones = ["salon1", "salon2", "salon3"];

async function run() {
  await producer.connect();
  setInterval(async () => {
    const zoneId = zones[Math.floor(Math.random() * zones.length)];
    const asistanceCount = Math.floor(Math.random() * 50) + 10;
    const msg = { zoneId, asistanceCount, timestamp: new Date().toISOString() };

    await producer.send({
      topic: "asistencia-events",
      messages: [{ key: zoneId, value: JSON.stringify(msg) }],
    });

    console.log(`Enviado: ${JSON.stringify(msg)}`);
  }, 2000);
}

run().catch(console.error);
