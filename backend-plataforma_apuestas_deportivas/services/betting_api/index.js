const express = require('express');
const {Kafka} = require('kafkajs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const kafka = new Kafka({brokers:['kafka:9092']});
const producer = kafka.producer();

const MATCHES = [
  { id: "m1", home: "Real Madrid", away: "Barcelona",  odds_home: 2.10, odds_draw: 3.40, odds_away: 3.80 },
  { id: "m2", home: "Nacional",  away: "Millonarios", odds_home: 2.45, odds_draw: 3.20, odds_away: 3.00 },
  { id: "m3", home: "Junior",  away: "América",  odds_home: 1.90, odds_draw: 3.50, odds_away: 4.20 },
  { id: "m4", home: "Once Caldas", away: "Santa Fe", odds_home: 2.80, odds_draw: 3.10, odds_away: 2.65 }
];

app.get('/matches',(req,res) => {
    res.json({matches:MATCHES});
})

app.post('/bet',async (req,res) => {
    const {user_id= "user123",match_id,bet_on,amount = 100} = req.body;
    if (!match_id || !bet_on) return res.status(400).json({error: "Faltan datos"});

    const event = {
        event_type: "BET_PLACED",
        user_id,
        match_id,
        bet_on,
        amount,
        timestamp: new Date().toISOString()
    };

    await producer.send({
        topic: 'match_events',
        messages: [{key:match_id, value: JSON.stringify(event)}]
    });

    console.log(`Apuesta recibida: ${user_id} -> ${match_id} (${bet_on})`);
    res.json({status:'ok',message:"Apuesta registrada"});
});

async function start() {
    await producer.connect();
    app.listen(3000,() => console.log("Betting API escuchando en el puerto 3000"));
}

start();