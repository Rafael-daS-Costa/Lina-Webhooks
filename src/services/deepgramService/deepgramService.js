const { createClient } = require('@deepgram/sdk');
const fs = require('fs');

const { DEEPGRAM_TOKEN } = process.env;
const deepgram = createClient(DEEPGRAM_TOKEN);

const getAudioTranscription = async (filePath) => {
  try {
    console.log('getAudioTranscription of', filePath);

    // Verifica se o arquivo existe e não está vazio
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error(`Arquivo está vazio: ${filePath}`);
    }

    // Faz a transcrição do áudio
    const response = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(filePath),
      {
        model: 'nova',
        language: 'pt-BR'
      }
    );

    console.log('Resposta do Deepgram:', response);

    // Verifica se a resposta da API é válida
    if (!response || !response.result || !response.result.results) {
      throw new Error('Deepgram retornou uma resposta inválida.');
    }

    console.log('getAudioTranscription ended successfully');
    return response.result.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    return null; // Retorna null para evitar crash na aplicação
  }
};

module.exports = { getAudioTranscription };
