module.exports = function authorize(setoresPermitidos = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.setor) {
      return res.status(403).json({ erro: 'Usuário sem setor definido' });
    }

    if (!setoresPermitidos.includes(req.user.setor)) {
      return res.status(403).json({ erro: 'Acesso negado para este setor' });
    }

    next();
  };
};
