const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const { authenticator } = require("otplib");
const QRCode = require("qrcode");
const crypto = require("crypto");

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

const mfaVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10,
  message: "Muitas tentativas de validação MFA. Tente novamente mais tarde."
});

const recoveryCodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5,
  message: "Muitas tentativas com código de recuperação. Tente novamente mais tarde."
});

// ✅ aplicado corretamente só nos endpoints de autenticação
app.post("/auth/login", loginLimiter);
app.post("/auth/mfa/verify", mfaVerifyLimiter);
app.post("/auth/mfa/recovery-code", recoveryCodeLimiter);

// =========================
// 🧠 DETECÇÃO DE ATAQUE
// =========================
const requests = {};

const detectorDeAtaque = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = {
      count: 1,
      startTime: now
    };
  } else if (now - requests[ip].startTime >= 60000) {
    requests[ip] = {
      count: 1,
      startTime: now
    };
  } else {
    requests[ip].count++;
  }

  const elapsed = now - requests[ip].startTime;

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
// 🔐 MFA
// =========================

// HELPERS
const MFA_TOKEN_TTL_MS = 5 * 60 * 1000;
const pendingMfaSessions = new Map();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const activeSessions = new Map();

function findUserByEmail(email) {
  return app.db.get("users").find({ email }).value();
}

function sanitizeUser(user) {
  const { password, mfaSecret, mfaTempSecret, mfaRecoveryCodes, ...safeUser } = user;
  return safeUser;
}

function hashRecoveryCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () => {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
  });
}

function createPendingMfaToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  pendingMfaSessions.set(token, {
    userId,
    expiresAt: Date.now() + MFA_TOKEN_TTL_MS
  });
  return token;
}

function consumePendingMfaToken(token) {
  const session = pendingMfaSessions.get(token);

  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    pendingMfaSessions.delete(token);
    return null;
  }

  return session;
}

function deletePendingMfaToken(token) {
  pendingMfaSessions.delete(token);
}

function createAccessToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.set(token, {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return token;
}

function getSession(token) {
  const session = activeSessions.get(token);

  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

function deleteSession(token) {
  activeSessions.delete(token);
}

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const session = getSession(token);

  if (!session) {
    return res.status(401).json({ error: "Token de autenticação inválido ou expirado." });
  }

  const user = app.db.get("users").find({ id: session.userId }).value();

  if (!user) {
    deleteSession(token);
    return res.status(401).json({ error: "Usuário não encontrado." });
  }

  req.user = user;
  req.sessionId = token;

  next();
}

// ROTAS
// Validar senha e decidir se precisa de MFA
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password).catch(() => false);

  if (!passwordMatches) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  if (!user.mfaEnabled) {
    const accessToken = createAccessToken(user.id);
    return res.status(200).json({
      accessToken,
      user: sanitizeUser(user)
    });
  }

  const mfaToken = createPendingMfaToken(user.id);

  return res.status(200).json({
    requiresMfa: true,
    mfaToken,
    user: sanitizeUser(user)
  });

});

// Gera QR code e secret TOTP
app.post("/auth/mfa/setup", authenticateAccessToken, async (req, res) => {
  const user = app.db.get("users").find({ id: req.user.id }).value();

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(user.email, "Happy Game", secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  app.db
    .get("users")
    .find({ id: req.user.id })
    .assign({ mfaTempSecret: secret })
    .write();

  return res.json({
    secret,
    otpauthUrl,
    qrCodeDataUrl,

  });
});

// Confirmar o primeiro código TOTP e ativar MFA
app.post("/auth/mfa/enable", authenticateAccessToken, (req, res) => {
  const { code } = req.body;

  const user = app.db.get("users").find({ id: req.user.id }).value();

  if (!user || !user.mfaTempSecret) {
    return res.status(400).json({ message: "Configuração de MFA não iniciada." });
  }

  const isValid = authenticator.verify({
    token: code,
    secret: user.mfaTempSecret
  });

  if (!isValid) {
    return res.status(400).json({ message: "Código de verificação inválido." });
  }

  const recoveryCodes = generateRecoveryCodes();
  const recoveryCodeHashes = recoveryCodes.map(hashRecoveryCode);

  app.db
    .get("users")
    .find({ id: req.user.id })
    .assign({
      mfaEnabled: true,
      mfaSecret: user.mfaTempSecret,
      mfaTempSecret: null,
      mfaRecoveryCodes: recoveryCodeHashes,
      mfaEnabledAt: new Date().toISOString(),
    })
    .write();

  return res.json({
    message: "MFA ativado com sucesso.",
    recoveryCodes
  });
});

// Concluir login com código TOTP
app.post("/auth/mfa/verify", (req, res) => {
  const { mfaToken, code } = req.body;

  const session = consumePendingMfaToken(mfaToken);

  if (!session) {
    return res.status(400).json({ message: "Token de MFA inválido ou expirado." });
  }

  const user = app.db.get("users").find({ id: session.userId }).value();

  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    return res.status(400).json({ message: "MFA não configurado para este usuário." });
  }

  const isValid = authenticator.verify({
    token: code,
    secret: user.mfaSecret
  });

  if (!isValid) {
    return res.status(400).json({ message: "Código de verificação inválido." });
  }

  deletePendingMfaToken(mfaToken);

  const accessToken = createAccessToken(user.id);

  return res.json({
    accessToken,
    user: sanitizeUser(user)
  });
});

// Concluir login com código de recuperação
app.post("/auth/mfa/recovery-code", (req, res) => {
  const { mfaToken, recoveryCode } = req.body;

  const session = consumePendingMfaToken(mfaToken);

  if (!session) {
    return res.status(400).json({ message: "Sesssão de MFA inválido ou expirado." });
  }

  const user = app.db.get("users").find({ id: session.userId }).value();

  if (!user) {
    deletePendingMfaToken(mfaToken);
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const hashedCode = hashRecoveryCode(recoveryCode);
  const existingCodes = user.mfaRecoveryCodes || [];
  const match = existingCodes.includes(hashedCode);


  if (!match) {
    deletePendingMfaToken(mfaToken);
    return res.status(400).json({ message: "Código de recuperação inválido." });
  }

  const updatedCodes = existingCodes.filter(code => code !== hashedCode);

  app.db
    .get("users")
    .find({ id: user.id })
    .assign({ mfaRecoveryCodes: updatedCodes })
    .write();

  deletePendingMfaToken(mfaToken);

  const accessToken = createAccessToken(user.id);

  return res.json({
    accessToken,
    user: sanitizeUser(user)
  });
});

// Invalida códigos antigos e gera novos
app.post("/auth/mfa/regenerate-recovery-codes", authenticateAccessToken, async (req, res) => {
  const { password, code } = req.body;

  const user = app.db.get("users").find({ id: req.user.id }).value();

  if (!user || !user.mfaEnabled) {
    return res.status(404).json({ message: "Usuário inválido" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password).catch(() => false);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  const isValid = authenticator.verify({
    token: code,
    secret: user.mfaSecret
  });

  if (!isValid) {
    return res.status(400).json({ message: "Código MFA inválido" });
  }

  const recoveryCodes = generateRecoveryCodes();
  const recoveryCodeHashes = recoveryCodes.map(hashRecoveryCode);

  app.db
    .get("users")
    .find({ id: user.id })
    .assign({ mfaRecoveryCodes: recoveryCodeHashes })
    .write();

  return res.json({
    message: "Códigos de recuperação regenerados com sucesso.",
    recoveryCodes
  });
});

// Logout
app.post("/auth/logout", authenticateAccessToken, (req, res) => {
  deleteSession(req.sessionId);
  return res.json({ message: "Logout realizado com sucesso." });
});

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
