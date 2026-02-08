const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota login
router.post('/login', authController.login);

// Rota cadastro
router.post('/usuarios', authController.cadastro); // 👈 aqui chamando função cadastro no controller

module.exports = router;
