const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/usuarios.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

const setoresAutorizados = [
  'LOGISTICA',
  'ESTOQUE',
  'TI',
  'COMPRAS',
  'FATURAMENTO'
];

module.exports = (app) => {
  app.post('/api/usuarios', (req, res) => {
    const { nome, email, senha, setor } = req.body;

    if (!nome || !email || !senha || !setor) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    if (!setoresAutorizados.includes(setor.toUpperCase())) {
      return res.status(403).json({ erro: 'Setor não autorizado' });
    }

    const usuarios = getUsers();

    if (usuarios.find(u => u.email === email)) {
      return res.status(409).json({ erro: 'Usuário já cadastrado' });
    }

    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      senha, // futuramente vamos hashear
      setor: setor.toUpperCase(),
      cargo: 'Pendente',
      role: 'USER',
      ativo: false,
      criadoEm: new Date()
    };

    usuarios.push(novoUsuario);
    saveUsers(usuarios);

    res.status(201).json({
      mensagem: 'Solicitação enviada. Aguarde liberação do administrador.'
    });
  });
};
