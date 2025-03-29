const axios = require('axios');
const { getFileAndTranscribe } = require('../mediaService/mediaService');
const { getWelcomeMessageTemplate } = require('../../templateMessages/templateMessages');
const { META_DEV_TOKEN } = process.env;
require('dotenv').config();

let msgText;

const sendPrimitiveAudioResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
  fileId,
) => {
  const transcribedAudio = await getFileAndTranscribe(fileId);
  msgText =
    `Olá ${userName}!\n` +
    `Você mandou um áudio com este conteúdo: \n*${transcribedAudio}*`;
  console.log(msgText);
  console.log('contact name', userName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: userNumber,
      text: { body: msgText },
    },
  });
};

const sendPrimitiveTextResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
  userMessage,
) => {
  msgText =
    `Olá ${userName}!\n` +
    `Você mandou a seguinte mensagem de texto: \n*${userMessage}*`;
  console.log(msgText);
  console.log('contact name', userName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: userNumber,
      text: { body: msgText },
    },
  });
};

const sendWelcomeResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
) => {
  msgText = getWelcomeMessageTemplate(userName);
  console.log(msgText);
  console.log('contact name', userName);
  await axios({
    method: 'POST',
    url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${META_DEV_TOKEN}`,
    },
    data: {
      messaging_product: 'whatsapp',
      to: userNumber,
      text: { body: msgText },
    },
  });
};

module.exports = {
  sendPrimitiveAudioResponseMessage,
  sendPrimitiveTextResponseMessage,
  sendWelcomeResponseMessage,
};
