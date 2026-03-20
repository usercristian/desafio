const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// Middlewares básicos
app.use(cors());
app.use(jsonServer.bodyParser);

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por IP
  message: "Muitas requisições, tente novamente depois."
});

app.use(limiter);

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // 5 tentativas
  message: "Muitas tentativas de login. Tente novamente mais tarde."
});


app.use("/login", loginLimiter);

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

app.use(auth);

app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});