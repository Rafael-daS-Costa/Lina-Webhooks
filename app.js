const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { 
  sendPrimitiveAudioResponseMessage, 
  sendPrimitiveTextResponseMessage } = 
  require('./src/messageChoserService/messageChoserService');
require('dotenv').config();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

// const token = process.env.META_DEV_TOKEN;
// const myToken = process.env.MY_TOKEN

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
  
  // check if the webhook request contains a message
  // details on WhatsApp text message payload: 
  // https://developers.facebook.com/docs/whatsapp
  // /cloud-api/webhooks/payload-examples#text-messages
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
    const messageFrom = req.body.entry[0].changes[0].value.messages[0].from;
    // let messageTimeStamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
    const ourNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    const status = req.body.entry[0].changes[0].statuses[0].status;
    const contactName = req.body.entry[0].changes[0].value.contacts[0].profile.name;

    if (!status) {
      if (messageType === 'audio') {
        await sendPrimitiveAudioResponseMessage(ourNumberId, messageFrom, contactName);
      }
      if (messageType === 'text') {
        await sendPrimitiveTextResponseMessage(ourNumberId, messageFrom, contactName);
      }
    }

  }
  
  // check if the incoming message contains text
  // if (message?.type === "text") {
  //   // extract the business number to send the reply from it
  //   const business_phone_number_id =
  //     req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  
  //   // send a reply message as per the docs here 
  // https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
  //   
  
  //   // mark incoming message as read
  //   await axios({
  //     method: "POST",
  //     url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
  //     headers: {
  //       Authorization: `Bearer ${META_DEV_TOKEN}`,
  //     },
  //     data: {
  //       messaging_product: "whatsapp",
  //       status: "read",
  //       message_id: message.id,
  //     },
  //   });
  // }
  
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.status(200).send('hello this is webhook setup');
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'public', 'privacy_policy.html'));
});
