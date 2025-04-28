const axios = require('axios');
const { getFileAndTranscribe } = require('../mediaService/mediaService');
const {
  getWelcomeMessageTemplate,
} = require('../../templateMessages/templateMessages');
const { getTiabeteIaMessage } = require('../tiabeteIAService/tiabeteIAService');
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
  const msgText = await getTiabeteIaMessage(transcribedAudio, userNumber);
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
  const msgText = await getTiabeteIaMessage(userMessage, userNumber);
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
  console.log(`Welcome message sent to ${userName} with number ${userNumber}`);
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
