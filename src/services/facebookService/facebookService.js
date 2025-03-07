const axios = require('axios');

const { META_DEV_TOKEN } = process.env;

async function getMediaUrl(idMedia){
  try{
    console.log('getMediaURL starting');
    const response = await axios({
      method: 'GET',
      url:
            'https://graph.facebook.com/v21.0/' + idMedia,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${META_DEV_TOKEN}`
      },
    });
    console.log('getMediaUrl end with data: ', response.data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao receber informações da mídia: ', error);
  }
}

async function downloadMedia(url){
  try{
    console.log('downloadMedia start');
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': `Bearer ${META_DEV_TOKEN}`,
      },
      responseType: 'arraybuffer'
    });
    console.log('downloadMedia end with data: ', response.data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao receber mídia: ', error);
  }
}

module.exports = { getMediaUrl, downloadMedia };