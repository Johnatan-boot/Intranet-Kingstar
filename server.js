const express = require("express"); //importando o modulo express.js Pois é, ele é o responsável por realizar o download de nossas dependências,
const path = require("path");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const authorize = require('./middlewares/authorizeMiddleware');

//esta linha significa que o node.js vai fazer importação de modulos require significa -> importação
const http = require("http");
//proximo passo
/*O módulo httpé responsável por criar e subir um servidor, mas qual servidor ele irá subir? Sim, até agora não criamos nenhum servidor, como essa é uma tarefa um tanto quanto chata, vamos utilizar um framework chamadoExpress:
 */

/*Definindo a rota de nosso servidor e Criamos o App
Para exemplo do post vamos definir apenas a rota principal, em outras palavras, a rota raiz, que é acessada quando informamos apenas a porta.
O primeiro passo será criar uma app, podemos fazer isso executando uma função que o express possuí:*/
const app = express();
const PORT = 3000;
const SECRET = "KINGSTAR_SUPER_SECRET";

/*Subindo o servidor
Agora que já temos tudo que precisamos vamos de fato subir nosso servidor.
Conforme dito anteriormante, para subir nosso servidor vamos utilizar o módulo do http, através dele temos uma função chamada createServer onde devemos passar um servidor para ele, mas, quem será nosso servidor? Sim, se você pensou no express parabéns, você acertou.*/
//http.createServer(express); trecho desnecessario

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// rotas
app.use("/api", authRoutes);

// exemplo de rota protegida
app.get("/api/secure", authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

/*CRIANDO NOSSA PRIMEIRA ROTA*/
/*Olha Express, quando alguém realizar uma requisição do tipo get para a raiz (informando apenas 
a porta), pegue a resposta (res) e envie (send) uma tag h1 com o conteúdo “Servidor rodando com ExpressJS”.*/
// Rota principal

// rota de login
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find((u) => u.email === email && u.senha === senha);

  if (!user || !user.ativo)
    return res.status(401).json({ erro: "Usuário inválido" });

  if (!SETORES_AUTORIZADOS.includes(user.setor))
    return res.status(403).json({ erro: "Setor não autorizado" });

  const token = jwt.sign(
  {
    id: user.id,
    nome: user.nome,
    setor: user.setor,
    cargo: user.cargo,
    role: user.role
  },
  jwtConfig.secret,
  { expiresIn: jwtConfig.expiresIn }
);


  res.json({ token });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.get("/estoque", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "estoque.html"));
});
app.get("/pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pedidos.html"));
});

//ROTA DE LOGISTICA
app.get(
  '/api/logistica/pedidos',
  authMiddleware,
  authorize(['LOGISTICA', 'GERENCIA']),
  (req, res) => {
    res.json(pedidos);
  }
);

/*Rodando o servidor
Como podemos fazer para que nosso servidor fique rodando eternamente até o mesmo ser parado? Para isso temos a função listen do http, ela recebe como primeiro parâmetro a porta que o servidor ficará escutando (aguardando requisições) e como segundo parâmetro devemos passar uma função de callback (que será executada após o servidor estiver rodando).
*/
//http.createServer(express).listen(3000, () => console.log("Servidor rodando local na porta 3000"));
/*Agora por último, na função createServer devemos passar agora o app e não mais o express:*/
//http.createServer(app).listen(3000, () => console.log("Servidor rodando local na porta 3000"));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
