const fs = require("fs");
const path = require("path");
const usuariosPath = path.join(__dirname, "../data/usuarios.json");
const setoresAutorizados = require("../data/setores"); // array com setores autorizados
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
  const user = usuarios.find(u => u.email === email);

  // 1️⃣ verifica se usuário existe
  if (!user) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  // 2️⃣ valida senha (bcrypt)
  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  // 3️⃣ verifica se está ativo
  if (!user.ativo) {
    return res.status(403).json({ erro: "Usuário inativo" });
  }

  // 4️⃣ verifica setor
  if (!setoresAutorizados.includes(user.setor)) {
    return res.status(403).json({ erro: "Setor não autorizado" });
  }

  const token = jwt.sign(
    { id: user.id, setor: user.setor, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.json({ token });
};


// ================= CADASTRO =================
exports.cadastro = async (req, res) => {
  let { nome, email, senha, setor } = req.body;

  nome = nome.trim();
  email = email.trim().toLowerCase();
  setor = setor.trim().toUpperCase();

  if (!nome || !email || !senha || !setor) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  if (!setoresAutorizados.includes(setor)) {
    return res.status(403).json({ erro: "Setor não autorizado" });
  }

  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));

  if (usuarios.find((u) => u.email.toLowerCase() === email)) {
    return res.status(409).json({ erro: "Usuário já cadastrado" });
  }

  // 🔐 hash correto
  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: uuidv4(),
    nome,
    email,
    senha: senhaHash,
    setor,
    cargo: "Pendente",
    role: "USER",
    ativo: false,
    criadoEm: new Date(),
  };

  usuarios.push(novoUsuario);
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

  res.status(201).json({
    mensagem: "Solicitação enviada. Aguarde aprovação do administrador.",
  });
};
