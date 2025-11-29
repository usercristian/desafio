// server.js
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// Vincular o banco de dados ao app
app.db = router.db;

// Permitir requisições do React
app.use(cors());
app.use(jsonServer.bodyParser);

// Regras de permissão (opcional)
const rules = auth.rewriter({
  users: 600,
});

app.use(rules);

// Endpoint customizado para checar existência de e-mail
app.get("/check-email", (req, res) => {
  const email = req.query.email;
  const users = router.db.get("users").value();
  const exists = users.some(u => u.email === email);
  res.json({ exists });
});

// Middleware de auth
app.use(auth);

// Rotas do JSON Server
app.use(router);

// Rodar na porta 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Fake API rodando em http://localhost:" + PORT);
});
