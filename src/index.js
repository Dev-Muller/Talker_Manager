const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql2');
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
const { validateRateId } = require('./middlewear/validateRate');

const app = express();

app.use(express.json());

// mysql.createPool qual a diferença para o createConnection?
const connection = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

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

app.get('/talker/db', (_req, res) => {
  connection.query('SELECT * FROM talkers', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }
    const talkers = results.map((result) => ({
      id: result.id,
      name: result.name,
      age: result.age,
      talk: {
        watchedAt: result.talk_watched_at,
        rate: result.talk_rate,
      }, 
    }));
    res.status(200).json(talkers);
  });
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

app.patch('/talker/rate/:id', authenticateToken, validateRateId, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  const talker = await readFileContent();
  const talkerId = talker.find((s) => s.id === +id);
  
  talkerId.talk.rate = rate;
  await writeFileContent(talker);
  
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});