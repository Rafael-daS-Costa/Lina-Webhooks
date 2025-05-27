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
  getAllAllowedUsers,
} = require('./src/mongoDb/mongoService');
const {
  getFileAndTranscribe,
} = require('./src/services/mediaService/mediaService');
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
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message !== undefined) {
    console.log('Message: ', message);
    console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));
  }

  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0]
  ) {
    const messageType = req.body.entry[0].changes[0].value.messages[0].type;
    const userNumber = req.body.entry[0].changes[0].value.messages[0].from;
    const status = req.body.entry[0].changes[0].statuses;
    // let messageTimeStamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
    const ourNumberId =
      req.body.entry[0].changes[0].value.metadata.phone_number_id;
    const userName =
      req.body.entry[0].changes[0].value.contacts[0].profile.name;

    if (!status) {
      const allowedUsers = await getAllAllowedUsers();

      const allowToMessage = allowedUsers.find(
        (item) => item.phoneNumber === userNumber,
      );

      //se allowedUserss é null, então não tem restrições de usuários
      //caso contrário, existem resitrições e devemos verificar allowToMessage
      if (allowToMessage !== undefined || allowedUsers === null) {
        console.log('User allowed: ', { userName, userNumber });
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
              userAudioId,
            );
          }
          if (messageType === 'text') {
            const messageContent =
              req.body.entry[0].changes[0].value.messages[0].text.body;
            await sendPrimitiveTextResponseMessage(
              ourNumberId,
              userNumber,
              messageContent,
            );
          }
        }
      } else {
        console.log('User not allowed', { userName, userNumber });
      }
    }
  }

  res.sendStatus(200);
});

app.get('/transcribe/:id', async (req, res) => {
  const mediaId = req.params.id;

  try {
    const transcription = await getFileAndTranscribe(mediaId);
    res.json({ success: true, transcription });
  } catch (error) {
    console.error('Error in /transcribe/:id:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// app.get('/allowed', async (_req, res) => {
//   try {
//     const response = await getAllAllowedUsers();

//     const allowToMessage = response.find(
//       (item) => item.phoneNumber === numberOfIntruser,
//     );
//     console.log({ allowToMessage });
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error in /transcribe/:id:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

app.get('/', (req, res) => {
  res.status(200).send('hello this is webhook setup');
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'public', 'privacy_policy.html'));
});
