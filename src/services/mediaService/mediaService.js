const { saveMedia } = require('../../utils/fileSaver');
const { getAudioTranscription } = require('../deepgramService/deepgramService');
const { getMediaUrl, downloadMedia } = require('../facebookService/facebookService');

async function getFileAndTranscribe(mediaId){
  try{
    console.log('getFileAndTranscribe start');
    // obtém informações do arquivo do facebook
    const mediaInfo = await getMediaUrl(mediaId);

    // faz download do arquivo do facebook
    const mediaFile = await downloadMedia(mediaInfo.url);

    // salva o arquivo na pasta files (ela precisa já estar criada)
    const filePath = `./files/file-${mediaId}.ogg`;
    saveMedia(filePath, mediaFile);

    // transcrição do arquivo de áudio
    const transcription = await getAudioTranscription(filePath);

    console.log('getFileAndTranscribe end');
    
    return transcription;
  } catch (e){
    throw new Error('Erro ao obter e transcrever arquivo: ', e);
  }
}

module.exports = { getFileAndTranscribe };