const fs = require('fs').promises;
const path = require('path');

async function readFileContent() {
  const DefPath = 'talker.json';
  const fileContent = await fs
    .readFile(path.resolve(path.join(__dirname, DefPath)), 'utf-8');
  
  const talkerJSON = JSON.parse(fileContent);
  return talkerJSON;
}

async function getAllTalkers() {
  try {
    return await readFileContent();
  } catch (error) {
    return console.log(error);
  }
}

async function getTalkerId(id) {
  const func = await readFileContent();
  try {
    const selectTalker = func.find((talker) => talker.id === Number(id));
    return selectTalker;
  } catch (error) {
    return console.log(error);
  }
}

async function writeFileContent(newTalker) {
  await fs.writeFile(path.join(__dirname, 'talker.json'), JSON.stringify(newTalker));
}

async function deleteFileContent(param) {
  try {
    const read = await readFileContent();
    const remove = read.filter((p) => p.id !== param);
    return await fs.writeFile(path.join(__dirname, 'talker.json'), JSON.stringify(remove));
    // return remove;
  } catch (error) {
    console.log(error);
  }
}

// async function filterFileContent(param) {
//   const read = await readFileContent();
    
// }

module.exports = { getAllTalkers,
  getTalkerId,
  readFileContent,
  writeFileContent,
  deleteFileContent };