const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const auditLog = require('../utils/auditLog');

const router = express.Router();
const usuariosPath = path.join(__dirname, '../data/usuarios.json');

// ATUALIZAR UM USUARIO EXISTENTE PENDENTE
router.put('/usuarios/:id/ativar', authMiddleware, adminMiddleware, (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
  const usuario = usuarios.find(u => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  usuario.ativo = true;

  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

  auditLog(`Ativou usuário ${usuario.email}`, req.user);

  res.json({ mensagem: 'Usuário ativado com sucesso' });
});

// LISTAR USUÁRIOS PENDENTES
router.get('/usuarios-pendentes', authMiddleware, adminMiddleware, (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
  const pendentes = usuarios.filter(u => !u.ativo);
  res.json(pendentes);
});

module.exports = router;
