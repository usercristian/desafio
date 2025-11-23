// server.js
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// Permitir requisições do React
app.use(cors());
app.use(jsonServer.bodyParser);

// Regras de permissão (opcional)
const rules = auth.rewriter({
  users: 600,
});

// Middleware de auth
app.use(rules);
app.use(auth);

// Rotas do JSON Server
app.use(router);

// Rodar na porta 3001
app.listen(3001, () => {
  console.log("Fake API rodando em http://localhost:3001");
});
