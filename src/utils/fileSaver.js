const fs = require('fs');

function saveMedia(filePath, data) {
  try {
    fs.writeFileSync(filePath, data);
    console.log(`Arquivo salvo com sucesso: ${filePath}`);
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
  }
}


module.exports ={ saveMedia };