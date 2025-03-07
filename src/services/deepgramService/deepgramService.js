const { createClient } = require('@deepgram/sdk');

const { DEEPGRAM_TOKEN } = process.env;

const fs = require('fs');

const deepgram = createClient(DEEPGRAM_TOKEN);

const getAudioTranscription = async (filePath) => {
  try {
    const { result } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(filePath),
      {
        model: 'nova',
        language: 'pt-BR'
      }
    );
    return result.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.log('Error trying to get audio transcription:', error);
  }
};

module.exports = { getAudioTranscription };