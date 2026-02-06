const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: 'Token não informado' });

  const [, token] = authHeader.split(' ');

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err)
      return res.status(403).json({ erro: 'Token inválido' });

    req.user = decoded;
    next();
  });
};
