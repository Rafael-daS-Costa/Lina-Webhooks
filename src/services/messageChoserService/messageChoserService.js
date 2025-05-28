const axios = require('axios');
const { getFileAndTranscribe } = require('../mediaService/mediaService');
const {
  getWelcomeMessageTemplate,
} = require('../../templateMessages/templateMessages');
const { getLinaIAMessage } = require('../linaIAService/linaIAService');
const { META_DEV_TOKEN } = process.env;
require('dotenv').config();

const sendPrimitiveAudioResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
  fileId,
) => {
  try {
    const transcribedAudio = await getFileAndTranscribe(fileId);
    const msgText = await getLinaIAMessage(transcribedAudio, userNumber);
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
  } catch (error) {
    console.error('sendPrimitiveAudioResponseMessage error:', {
      error,
      message: error.message,
    });
  }
};

const sendPrimitiveTextResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
  userMessage,
) => {
  try {
    const msgText = await getLinaIAMessage(userMessage, userNumber);
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
  } catch (error) {
    console.error('sendPrimitiveTextResponseMessage error:', {
      error,
      message: error.message,
    });
  }
};

const sendWelcomeResponseMessage = async (
  ourNumberId,
  userNumber,
  userName,
) => {
  try {
    const msgText = getWelcomeMessageTemplate(userName);
    console.log(
      `Welcome message sent to ${userName} with number ${userNumber}`,
    );
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
  } catch (error) {
    console.error('sendWelcomeMessageTemplate error:', {
      error,
      message: error.message,
    });
  }
};

module.exports = {
  sendPrimitiveAudioResponseMessage,
  sendPrimitiveTextResponseMessage,
  sendWelcomeResponseMessage,
};
