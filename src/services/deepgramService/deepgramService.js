const { createClient } = require('@deepgram/sdk');
const fs = require('fs');

const { DEEPGRAM_TOKEN } = process.env;
const deepgram = createClient(DEEPGRAM_TOKEN);

const getAudioTranscription = async (filePath) => {
  try {
    console.log('getAudioTranscription of', filePath);

    // Verifica se o arquivo existe e não está vazio
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error(`Empty file: ${filePath}`);
    }

    // Faz a transcrição do áudio
    const response = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(filePath),
      {
        model: 'nova-2-general',
        language: 'pt-BR',
      },
    );

    console.log('Deepgram response:', response);

    // Verifica se a resposta da API é válida
    if (!response || !response.result || !response.result.results) {
      throw new Error('Deepgram returned invalid result');
    }

    console.log('getAudioTranscription ended successfully');
    return response.result.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Error on audio transcription:', error);
    return null; // Retorna null para evitar crash na aplicação
  }
};

module.exports = { getAudioTranscription };
