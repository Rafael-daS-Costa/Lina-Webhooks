require('dotenv').config();

const { TIABETE_IA_API_KEY } = process.env;

const getTiabeteIaMessage = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': TIABETE_IA_API_KEY,
        },
      },
    );

    console.log('Resposta:', response.data);
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

module.exports = { getTiabeteIaMessage };
