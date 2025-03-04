const axios = require('axios');
const { META_DEV_TOKEN } = process.env;


let msgText;

const sendPrimitiveAudioResponseMessage = async (
  ourNumberId, 
  messageFrom, 
  contactName) => {
  msgText = `Olá ${contactName}! Esta é uma mensagem de áudio`;
  console.log(msgText);
  console.log('contact name', contactName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: messageFrom,
      text: { body: msgText },
    },
  });
};

const sendPrimitiveTextResponseMessage = async (
  ourNumberId,
  messageFrom,
  contactName) => {
  msgText = `Olá ${contactName}! Esta é uma mensagem de texto`;
  console.log(msgText);
  console.log('contact name', contactName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: messageFrom,
      text: { body: msgText },
    },
  });
};

module.exports = { sendPrimitiveAudioResponseMessage, sendPrimitiveTextResponseMessage };