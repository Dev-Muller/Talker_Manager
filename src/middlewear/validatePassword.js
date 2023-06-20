function validatePassword(req, res, next) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json(
        { message: 'O campo "password" é obrigatório' },
      );
    }
  const verify = password >= 6;
  if (!verify) {
    return res.status(400).json(
      {
        message: 'O "password" deve ter pelo menos 6 caracteres',
      },
    );
  }

  next();
}

module.exports = validatePassword;