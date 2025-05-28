const { default: axios } = require('axios');

require('dotenv').config();

const { LINA_IA_API_KEY, LINA_IA_URL } = process.env;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getLinaIAMessage = async (message, userId, maxRetries = 3, delayMs = 120000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        LINA_IA_URL,
        {
          message,
          user_id: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': LINA_IA_API_KEY,
          },
        }
      );

      console.log('Lina response:', { response: response.data });
      return response.data.response;
    } catch (error) {
      console.error(`Tentativa ${attempt} falhou:`, error.message);

      if (attempt === maxRetries) {
        console.error('Máximo de tentativas atingido. Abortando.');
        throw error;
      }

      await delay(delayMs);
    }
  }
};


module.exports = { getLinaIAMessage };
