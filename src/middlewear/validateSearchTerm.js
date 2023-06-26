const { readFileContent } = require('../talkerUtils');

async function validateSearchTerm(req, res, next) {
  const { q: searchTerm, rate, watchedAt } = req.query;

  const read = await readFileContent();

  if ((!searchTerm || searchTerm.trim() === '') && !rate && watchedAt) {
    return res.status(200).json(read);
  }

  next();
}

function validateSearchRate(req, res, next) {
  const { rate } = req.query;

  if (rate && (!Number.isInteger(+rate) || +rate < 1 || +rate > 5)) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
}

async function validateSearchWatchAt(req, res, next) {
  const { date } = req.query;

  const read = await readFileContent();
  if (date === '' || !date) {
    return res.status(200).json(read);
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
}
  
module.exports = { validateSearchTerm, validateSearchRate, validateSearchWatchAt };