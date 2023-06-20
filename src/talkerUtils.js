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

async function getTalkerId(id) {
  const talkerPath = 'talker.json';
  const fileContent = await fs
    .readFile(path.resolve(path.join(__dirname, talkerPath)), 'utf-8');

  const talkers = JSON.parse(fileContent);

  try {
    const selectTalker = talkers.find((talker) => talker.id === Number(id));
    return selectTalker;
  } catch (error) {
    return console.log(error);
  }
}
module.exports = { getAllTalkers, getTalkerId };