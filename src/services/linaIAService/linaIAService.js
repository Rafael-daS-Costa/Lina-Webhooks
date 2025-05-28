const { default: axios } = require('axios');

require('dotenv').config();

const { LINA_IA_API_KEY, LINA_IA_URL } = process.env;

const getLinaIAMessage = async (message, userId) => {
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
        timeout: 100000,
      },
    );

    console.log('Lina response:', { response: response.data });
    return response.data.response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

module.exports = { getLinaIAMessage };
