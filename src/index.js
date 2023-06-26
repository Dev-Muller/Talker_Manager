const express = require('express');
const crypto = require('crypto');
const { getAllTalkers,
  getTalkerId,
  readFileContent,
  writeFileContent, deleteFileContent } = require('./talkerUtils');
const validateEmail = require('./middlewear/validateEmail');
const validatePassword = require('./middlewear/validatePassword');
const { validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerRate,
  validateTalkerWatchedAt,
} = require('./middlewear/validateNewTalker');
const authenticateToken = require('./middlewear/validateAuth');
const { validateSearchTerm,
  validateSearchRate, validateSearchWatchAt } = require('./middlewear/validateSearchTerm');
// const anotherRouter = require('./routes/anotherRouter');
const app = express();

app.use(express.json());
// app.use('/another', anotherRouter);

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const response = await getAllTalkers();
  if (!response) {
    return res.status(400).json([]);
  }
  return res.status(200).json(response);
});

app.get('/talker/search', authenticateToken,
  validateSearchRate, validateSearchTerm, validateSearchWatchAt, async (req, res) => {
  const { q: searchTerm, rate, date } = req.query;

  const read = await readFileContent();

  const filteredTalkers = read.filter((talker) => {
    const matchesSearchTerm = searchTerm
        ? talker.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    const matchesRate = req.query.rate ? talker.talk.rate === +rate : true;
    const watchedAtSearch = talker.talk.watchedAt === date;
    return matchesSearchTerm && matchesRate && watchedAtSearch;
  });

  return res.status(200).json(filteredTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const response = await getTalkerId(Number(id));
  if (!response) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(response);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

app.post('/talker', authenticateToken, validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk, validateTalkerRate, validateTalkerWatchedAt, async (req, res) => {
    const talker = req.body;
    const response = await readFileContent();
    const id = response.length + 1;
    const newTalker = { id, ...talker };
    response.push(newTalker);
    await writeFileContent(response);
    return res.status(201).json(newTalker);
});

app.put('/talker/:id', authenticateToken, validateTalkerName,
validateTalkerAge,
validateTalkerTalk, validateTalkerRate, validateTalkerWatchedAt, async (req, res) => {
  const { id } = req.params;
  const talker = req.body;
  const response = await getTalkerId(Number(id));
  if (response === undefined) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const editedTalker = { id: Number(id), ...talker };
  const allTalkers = await getAllTalkers();
  const talkerMap = allTalkers.map((talke) => {
    if (talke.id === editedTalker.id) {
      return editedTalker;
    }
    return talke;
  });
  await writeFileContent(talkerMap);
  return res.status(200).json(editedTalker);
});

app.delete('/talker/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteFileContent(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});