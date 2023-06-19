const fs = require('fs').promises;
const path = require('path');

async function getAllTalkers() {
  const DefPath = 'talker.json';
  // path.resolve(__dirname, 'src', 'talker.json')
  try {
    const fileContent = await fs
      .readFile(path.resolve(path.join(__dirname, DefPath)), 'utf-8');
  
    const talker = JSON.parse(fileContent);
  
    return talker;
  } catch (error) {
    return console.log(error);
  }
}

module.exports = { getAllTalkers };