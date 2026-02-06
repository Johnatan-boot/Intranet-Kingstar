const jwt = require('jsonwebtoken');
const usuarios = require('../data/usuarios.json');
const setoresAutorizados = require('../data/setores');
const jwtConfig = require('../config/jwt');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  if (!user)
    return res.status(401).json({ erro: 'Credenciais inválidas' });

  if (!user.ativo)
    return res.status(403).json({ erro: 'Usuário inativo' });

  if (!setoresAutorizados.includes(user.setor))
    return res.status(403).json({ erro: 'Setor não autorizado' });

  const token = jwt.sign(
    { id: user.id, setor: user.setor },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.json({ token });
};
