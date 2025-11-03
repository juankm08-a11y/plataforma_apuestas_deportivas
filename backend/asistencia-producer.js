const { Kafka } = require("kafkajs");
const { amqp } = require("amqp");

const kafka = new Kafka({
  clientId: "asistencia-producer",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const zones = ["salon1", "salon2", "salon3"];

const RABBITMQ_URL = "amqp://192.168.80.1";

async function conectRabbit() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "direct", { durable: false });
  console.log(`Conectado a RabbitMQ y exchange listo`);
  return channel;
}

async function run() {
  await producer.connect();
  rabbitChannel = await conectRabbit();

  setInterval(async () => {
    const zoneId = zones[Math.floor(Math.random() * zones.length)];
    const asistanceCount = Math.floor(Math.random() * 50) + 10;
    const msg = { zoneId, asistanceCount, timestamp: new Date().toISOString() };

    await producer.send({
      topic: "asistencia-events",
      messages: [{ key: zoneId, value: JSON.stringify(msg) }],
    });

    console.log(`Enviado: ${JSON.stringify(msg)}`);

    const mensajeRabbit = `Zona: ${zoneId} tiene ${asistanceCount} asistentes (${msg.timestamp})`;
    rabbitChannel.publish(
      EXCHANGE,
      "asistencia.alerta",
      Buffer.from(mensajeRabbit)
    );
    console.log(`RabbitMQ publicado: ${mensajeRabbit}`);
  }, 2000);
}

run().catch(console.error);
