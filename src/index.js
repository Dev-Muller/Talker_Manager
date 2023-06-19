const express = require('express');
const { getAllTalkers } = require('./talkerUtils');
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
  if(!response) {
    return res.status(400).json([]);
  }
  return res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log('Online');
});

