const fs = require('fs');

function saveMedia(filePath, data){
  try {
    console.log('saveMedia start');
    fs.writeFileSync(filePath, data);
    console.log('saveMedia end');
  } catch (error) {
    throw error;
  }
}

module.exports ={ saveMedia };