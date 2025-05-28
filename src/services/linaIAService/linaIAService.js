require('dotenv').config();

const { LINA_IA_API_KEY, LINA_IA_URL } = process.env;

const getLinaIAMessage = async (message, userId) => {
  try {
    const response = await fetch(LINA_IA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': LINA_IA_API_KEY,
      },
      body: JSON.stringify({
        message,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Lina response:', { response: data });
    return data.response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};


module.exports = { getLinaIAMessage };
