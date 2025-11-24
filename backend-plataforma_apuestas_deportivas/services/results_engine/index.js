const {Kafka} = require('kafkajs');
const amqp = require('amqplib');

const matchState = new Map();
const kafka = new Kafka({brokers: ['kafka:9092']});
const consumer = kafka.consumer({groupId: 'results-group'});
let channel;

async function main() {
    await consumer.connect();
    await consumer.subscribe({topic:'match_events',fromBeginning:true});

    const conn = await amqp.connect('amqp://rabbitmq:5672');
    channel = await conn.createChannel();

    await channel.assertExchange('notifications','topic',{durable:false})

    await consumer.run({
        eachMessage: async ({message}) => {
            const event = JSON.parse(message.value.toString());
            const {event_type, match_id} = event;

            if (event_type === "MATCH_CREATED") {
                matchState.set(match_id, {
                    status: "OPEN_FOR_BETS",
                    teams: event.teams,
                    bets: []
                });
                notifyDashboard(match_id, "OPEN");
            }

            if (event_type === "BET_PLACED") {
                const state = matchState.get(match_id);
                if (state && state.status === "OPEN_FOR_BETS") {
                    state.bets.push({
                        user_id: event.user_id,
                        bet_on: event.bet_on === state.teams[0] ? 0:1,
                        amount: event.amount,
                    });
                }
            }

            if (event_type === "MATCH_FINISHED") {
                const state = matchState.get(match_id);
                if (!state) return;

                const winnerIndex = event.winner_index;
                state.status = "CLOSED";
                state.winner = winnerIndex;

                state.bets.forEach(bet => {
                    const won = bet.bet_on === winnerIndex;
                    const winnings = won ? bet.amount * 1.9 :0;

                    channel.publish('notifications',won ? 'notify.email.win' : 'notify.email.loss',Buffer.from(JSON.stringify({
                        user_id: bet.user_id,
                        match_id,
                        winnings: won ? winnings : bet.amount,
                        won
                    })));

                });
                notifyDashboard(match_id, "CLOSED",winnerIndex);
            }
        }
    })
}

function notifyDashboard(match_id, status,winnerIndex = null) {
    const state = matchState.get(match_id);
    channel.publish('notifications','notify.dashboard.update',Buffer.from(JSON.stringify({
        match_id,
        status,
        teams: state.teams,
        winner: winnerIndex != null ? state.teams[winnerIndex] : null
    })));
}

main().catch(console.error);