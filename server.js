/*
VERSAO JSON PREPARADA PARA REACT.JS

const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server rodando em http://localhost:3000");
});
*/


/*
VERSÃO PREPARADA PARA O HTML,CSS,JAVASCRIPT
*/
const express = require('express');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = 3000;

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// rotas de API
app.use('/api', authRoutes);       // login e cadastro
app.use('/api/admin', adminRoutes); // admin

// páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Dashboard
app.get(['/dashboard-log', '/dashboard-log.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-log.html'));
});
// Dashboard
app.get(['/dashboard', '/dashboard.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Admin
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


