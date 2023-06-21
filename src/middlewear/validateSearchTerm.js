const { readFileContent } = require('../talkerUtils');

async function validateSearchTerm(req, res, next) {
  const { q: searchTerm } = req.query;

  const read = await readFileContent();

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(200).json(read);
  }

  next();
}

function validateSearchRate(req, res, next) {
  const { rate } = req.query;

  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(+rate) || +rate < 1 || +rate > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
}
  
module.exports = { validateSearchTerm, validateSearchRate };