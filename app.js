const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {
  sendPrimitiveAudioResponseMessage,
  sendPrimitiveTextResponseMessage,
  sendWelcomeResponseMessage,
} = require('./src/services/messageChoserService/messageChoserService');
const {
  createUser,
  findUserByPhoneNumber,
} = require('./src/mongoDb/mongoService');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

const { MY_TOKEN } = process.env;

app.listen(process.env.PORT, () => {
  console.log('Example webhook listening');
});

//to verify the callback
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === MY_TOKEN) {
    res.status(200).send(challenge);
    console.log('Webhook verified successfully!');
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  // log incoming messages
  console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  console.log('Message: ', message);

  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0]
  ) {
    const messageType = req.body.entry[0].changes[0].value.messages[0].type;
    const userNumber = req.body.entry[0].changes[0].value.messages[0].from;
    // let messageTimeStamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
    const ourNumberId =
      req.body.entry[0].changes[0].value.metadata.phone_number_id;
    const status = req.body.entry[0].changes[0].statuses;
    const userName =
      req.body.entry[0].changes[0].value.contacts[0].profile.name;

    if (!status) {
      const user = await findUserByPhoneNumber(userNumber);

      if (user === null) {
        //manda mensagem de boas vindas e cria usuário no banco
        await sendWelcomeResponseMessage(ourNumberId, userNumber, userName);
        await createUser(userName, userNumber);
      } else {
        if (messageType === 'audio') {
          const userAudioId =
            req.body.entry[0].changes[0].value.messages[0].audio.id;
          await sendPrimitiveAudioResponseMessage(
            ourNumberId,
            userNumber,
            userName,
            userAudioId,
          );
        }
        if (messageType === 'text') {
          const messageContent =
            req.body.entry[0].changes[0].value.messages[0].text.body;
          await sendPrimitiveTextResponseMessage(
            ourNumberId,
            userNumber,
            userName,
            messageContent,
          );
        }
      }
    }
  }

  res.sendStatus(200);
});

// app.post('/tiabette', async (req, res) => {
//   // console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));

//   const messageData = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

//   if (messageData && messageData.type === 'text') {
//     const userMessage = messageData.text.body;

//     try {
//       // Enviar mensagem para o chatbot Python
//       const chatbotResponse = await axios.post('http://localhost:5001/chat', {
//         message: userMessage,
//       });

//       const botReply = chatbotResponse.data.response;

//       // Enviar resposta do chatbot para o usuário no WhatsApp
//       console.log(botReply);
//     } catch (error) {
//       console.error('Erro ao conectar com o chatbot:', error);
//     }
//   }

//   res.sendStatus(200);
// });

app.get('/', (req, res) => {
  res.status(200).send('hello this is webhook setup');
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'public', 'privacy_policy.html'));
});
