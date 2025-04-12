const fs = require('fs');

function saveMedia(filePath, data) {
  try {
    fs.writeFileSync(filePath, data);
    console.log(`Arquivo salvo com sucesso: ${filePath}`);
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
  }
}

function deleteMedia(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`Arquivo deletado com sucesso: ${filePath}`);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
  }
}

module.exports = { saveMedia, deleteMedia };
