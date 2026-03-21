const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// 🔥 necessário para o json-server-auth funcionar corretamente
app.db = router.db;

// =========================
// 🔧 Middlewares básicos
// =========================
app.use(cors());
app.use(jsonServer.bodyParser);

// =========================
// 🚨 RATE LIMIT GLOBAL
// =========================
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: "Muitas requisições, tente novamente depois."
});

app.use(limiter);

// =========================
// 🔐 RATE LIMIT LOGIN
// =========================
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5,
  message: "Muitas tentativas de login. Tente novamente mais tarde."
});

// ✅ aplicado corretamente só no POST /login
app.post("/login", loginLimiter);

// =========================
// 🧠 DETECÇÃO DE ATAQUE
// =========================
const requests = {};

const detectorDeAtaque = (req, res, next) => {
  const ip = req.ip;

  if (!requests[ip]) {
    requests[ip] = {
      count: 1,
      startTime: Date.now()
    };
  } else {
    requests[ip].count++;
  }

  const elapsed = Date.now() - requests[ip].startTime;

  if (requests[ip].count > 200 && elapsed < 60000) {
    console.log("🚨 POSSÍVEL ATAQUE DETECTADO:", ip);

    return res.status(429).json({
      error: "Comportamento suspeito detectado"
    });
  }

  next();
};

app.use(detectorDeAtaque);

// =========================
// 🔒 AUTENTICAÇÃO
// =========================
app.use(auth);

// =========================
// 📦 ROTAS
// =========================
app.use(router);

// =========================
// 🚀 START SERVER
// =========================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});