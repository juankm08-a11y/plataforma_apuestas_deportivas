const { Kafka } = require("kafkajs");
const amqp = require('amqplib');
const fetch = require('node-fetch');

const kafka = new Kafka({brokers: ['kafka:9092']});
const producer = kafka.producer();
const teams = ["Millonarios","Nacional","Santa Fe","America","Junior","Once Caldas","Deportivo Cali","Tolima"];

let conn,channel;

const openMatches = new Set();

async function start() {
    await producer.connect();
    conn = await amqp.connect('amqp://rabbitmq:5672');
    channel = await conn.createChannel();

    await channel.assertExchange('delayed_match','x-delayed-message',{
    durable: true,
    arguments: {'x-delayed-type':'direct'}  
    });

    await channel.assertQueue('match_simulation_queue',{durable:true});
    await channel.bindQueue('match_simulation_queue','delayed_match','simulate');

    setInterval(createMatch, 10000);
    createMatch();

    setInterval(botBetting, 7000);

}

let matchConunter = 1;

async function createMatch() {
    const teamA = teams[Math.floor(Math.random() * teams.length)];
    let teamB;
    do {
        teamB = teams[Math.floor(Math.random() * teams.length)];
    } while (teamB === teamA);

    const matchId = `m${Date.now()}-${matchConunter++}`;
    const event = {
        event_type: 'MATCH_CREATED',
        match_id: matchId,
        teams: [teamA,teamB],
        timestamp: new Date().toISOString()
    };

    await producer.send({
        topic: 'match_events',
        messages: [{key: matchId, value: JSON.stringify(event)}]
    })

    await channel.publish('delayed_match','simulate',Buffer.from(JSON.stringify({matchId})), {
        headers: {'x-delay': 60000 }, 
        persistent: true
    });

    openMatches.add(matchId);

    console.log(`Partido creado: ${matchId} - ${teamA} vs ${teamB}` );
}

async function botBetting() {
    if (openMatches.size === 0) return;

    const matchesArray = Array.from(openMatches);
    const matchId = matchesArray[Math.floor(Math.random() * matchesArray.length)];

    const teamIndex = Math.random() < 0.5 ? 0:1;
    const teamName = teamIndex === 0
      ? "Millonarios,Nacional,SantaFe,América, Junior, Once Caldas, Deportivo Cali, Tolima".split(",")[teamIndex]
      : "el otro equipo";

    const botNames = ["Fut_Robot","Bot_Cyborg","Bot_bol","Bot_Terminator","Bot_Wall-E","Bot_R2D2"];
    const botId = botNames[Math.floor(Math.random() * botNames.length)];

    try {
        await fetch("https://betting_api:3000/bet", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({
                user_id: botId,
                match_id: matchId,
                bet_on: teamIndex === 0 ? "local":"visitante",
                amount: Math.floor(Math.random() * 400) + 100
            })
        });
        console.log(`Bot ${botId} apostó $${matchConunter.floor(Math.random() * 400) + 100} en ${matchId}`);
    } catch (err) {
        
    }
}

setInterval(() => {

},3000);

start().catch(console.error);