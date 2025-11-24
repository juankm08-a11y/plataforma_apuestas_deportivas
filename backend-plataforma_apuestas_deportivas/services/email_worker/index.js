const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const EMAIL_USER = "juancarlospabon01@gmail.com";
const EMAIL_PASS = "dxkc xvyq oant odny";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  }
});

async function enviarEmail(to,subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"BetLive Colombia" <${EMAIL_USER}`,
      to: to,
      subject: subject,
      text: text,
      html: `
      <div style="font-family:Arial;background:#0f2027;color:white;padding:30px;border-radius:15px;text-align:center;">
          <h1 style="color:#00ff88;">BetLive Colombia</h1>
          <h2>${subject}</h2>
          <p style="font-size:18px;">${text}</p>
          <hr style="border-color:#00ff88;">
          <p>Gracias por jugar con nosotros</p>
        </div>`
      
    })
    console.log(`Email enviado a ${to} -> MessageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.log('Contraseña de aplicacion incorrecta o cuenta bloqueada');
  }
}

async function start() {
  const conn = await amqp.connect('amqp://rabbitmq:5672');
  const ch = await conn.createChannel();

  const routingKeys = ['notify.email.win','notify.email.loss'];
  for (const rk of routingKeys) {
    const q = await ch.assertQueue('',{exclusive:true});
    await ch.bindQueue(q.queue, 'notifications',rk);

    ch.consume(q.queue, async (msg) => {
      if (!msg) return;
      
     try {
      
       const data = JSON.parse(msg.content.toString());

        const emailDestino = 'juancarlospabon01@gmail.com';

        const esGanador = data.won;
        const monto = esGanador ? data.winnings : (data.amount || data.winnings);

        const subject = esGanador
        ? "¡FELICITACIONES! Ganaste en BetLive"
        : "Resultado de tu apuesta - BetLive";

      
        const text = esGanador 
        ? `¡GANASTE ${monto.toFixed(0)} pesos colombianos!\nPartido: ${data.match_id}\n¡Sigue apostando y conviértete en millonario!`
        : `Esta vez no fue tu día. Perdiste ${monto} pesos.\nPartido: ${data.match_id}\n¡La próxima es la vencida!`; 

        console.log(`ENVIANDO EMAIL a ${esGanador ? ' DE VICTORIA' : ''} a ${emailDestino} `);

        await enviarEmail(emailDestino,subject ,text);

        ch.ack(msg);
     } catch (err) {
       console.error("Error procesando mensaje:",err);
       ch.nack(msg,false,false);
     }
    });
  }

  console.log("Email Worker Activo");
}

start().catch(err => {
  console.error("Error fatal en email worker:",err);
  process.exit(1);
})