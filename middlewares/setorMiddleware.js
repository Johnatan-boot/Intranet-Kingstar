module.exports = (setoresPermitidos = []) => {
  return (req, res, next) => {
    if (!setoresPermitidos.includes(req.user.setor)) {
      return res.status(403).json({ erro: 'Setor sem permissão' });
    }
    next();
  };
};



