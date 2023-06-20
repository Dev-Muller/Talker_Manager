const express = require('express');
const crypto = require('crypto');
const { getAllTalkers, getTalkerId, readFileContent, writeFileContent } = require('./talkerUtils');
const validateEmail = require('./middlewear/validateEmail');
const validatePassword = require('./middlewear/validatePassword');
const { validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerRate,
  validateTalkerWatchedAt,
} = require('./middlewear/validateNewTalker');
const authenticateToken = require('./middlewear/validateAuth');
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

app.listen(PORT, () => {
  console.log('Online');
});