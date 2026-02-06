const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/usuarios.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersPath));
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

module.exports = (app) => {
  app.post('/api/usuarios', (req, res) => {
    const { nome, email, senha, setor } = req.body;

    if (!nome || !email || !senha || !setor) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
      return res.status(409).json({ erro: 'Usuário já existe' });
    }

    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      senha,
      setor,
      cargo: 'Pendente',
      role: 'USER',
      ativo: false // 👈 importante
    };

    users.push(novoUsuario);
    saveUsers(users);

    res.json({
      mensagem: 'Solicitação enviada. Aguarde liberação do administrador.'
    });
  });
};
