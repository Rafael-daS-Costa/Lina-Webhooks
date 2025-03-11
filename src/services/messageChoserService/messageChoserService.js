const axios = require('axios');
const { getFileAndTranscribe } = require('../mediaService/mediaService');
const { META_DEV_TOKEN } = process.env;

let msgText;

const sendPrimitiveAudioResponseMessage = async (
  ourNumberId,
  messageFrom,
  contactName,
  fileId,
) => {
  const transcribedAudio = await getFileAndTranscribe(fileId);
  msgText =
    `Olá ${contactName}!\n` +
    `Você mandou um áudio com este conteúdo: \n*${transcribedAudio}*`;
  console.log(msgText);
  console.log('contact name', contactName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${META_DEV_TOKEN}`,
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
  contactName,
  userMessage,
) => {
  msgText =
    `Olá ${contactName}!\n` +
    `Você mandou a seguinte mensagem de texto: \n*${userMessage}*`;
  console.log(msgText);
  console.log('contact name', contactName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: messageFrom,
      text: { body: msgText },
    },
  });
};

module.exports = {
  sendPrimitiveAudioResponseMessage,
  sendPrimitiveTextResponseMessage,
};
