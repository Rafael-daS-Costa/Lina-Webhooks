const { default: axios } = require('axios');

require('dotenv').config();

const { TIABETE_IA_API_KEY, TIABETE_IA_URL } = process.env;

const getTiabeteIaMessage = async (message, userId) => {
  try {
    const response = await axios.post(
      TIABETE_IA_URL,
      {
        message,
        user_id: userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': TIABETE_IA_API_KEY,
        },
      },
    );

    console.log('Tiabete response:', { response: response.data });
    return response.data.response;
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

module.exports = { getTiabeteIaMessage };
