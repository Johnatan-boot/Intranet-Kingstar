module.exports = (req, res, next) => {
  // segurança extra: garante que o authMiddleware rodou antes
  if (!req.user) {
    return res.status(401).json({ erro: 'Token não informado ou inválido' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores' });
  }

  next();
};
