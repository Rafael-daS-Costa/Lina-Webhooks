const { default: axios } = require('axios');

require('dotenv').config();

const { LINA_IA_API_KEY, LINA_IA_URL } = process.env;

const getLinaIaMessage = async (message) => {
  try {
    const response = await axios.post(
      LINA_IA_URL,
      {
        message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': LINA_IA_API_KEY,
        },
      },
    );

    console.log('LINA response:', { response: response.data });
    return response.data.response;
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

module.exports = { getLinaIaMessage };
