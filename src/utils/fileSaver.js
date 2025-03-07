const fs = require('fs');

async function saveMedia(filePath, data){
  console.log('saveMedia start');
  fs.writeFile(filePath, data, (error) => {
    if(error){
      throw new Error('Erro ao salvar arquivo: ', error);
    }
  });
  console.log('saveMedia end');
}

module.exports ={ saveMedia };