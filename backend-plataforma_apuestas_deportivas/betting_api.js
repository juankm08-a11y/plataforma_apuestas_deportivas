const { Kafka } = require("kafkajs");
const amqp = require("amqp");

const kafka = new Kafka({
  clientId: "betting-api",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const RABBITMQ_URL = "amqp://guest:guest@rabbitMQ";
const EXCHANGE = "betting_exchange";
const ROUTING_KEY = "match.alert";

async function connectRabbit() {
  return new Promise((resolve, reject) => {
    const connection = amqp.createConnection({ url: RABBITMQ_URL });

    connection.on("ready", () => {
      console.log("Betting API conectado a RabbitMQ");

      connection.exchange(
        EXCHANGE,
        { type: "direct", durable: false },
        (exchange) => resolve({ connection, exchange })
      );
    });

    connection.on("error", reject);
  });
}

async function run() {
  await producer.connect();
  const { exchange } = await conectRabbit;
}

run().catch(console.error);
