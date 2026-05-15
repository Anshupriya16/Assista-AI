import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const getEnv = (key) => String(process.env[key] || "").trim();
const hasEnv = (key) => Boolean(getEnv(key));
const maskValue = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "not set";
  if (trimmed.length <= 8) return "set, too short";
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)} (${trimmed.length} chars)`;
};
const allowedOrigins = [
  ...getEnv("CLIENT_URL")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...getEnv("CLIENT_URLS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const dbReady = connectDB().then((connected) => {
  app.locals.dbConnected = connected;
  return connected;
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/health", async (req, res) => {
  const connected = await connectDB();
  app.locals.dbConnected = connected;

  res.json({
    status: "ok",
    database: app.locals.dbConnected ? "connected" : "unavailable",
    ai: {
      provider: getEnv("AI_PROVIDER") || "auto",
      geminiConfigured: hasEnv("GEMINI_API_KEY") || hasEnv("GOOGLE_API_KEY"),
      openaiConfigured: hasEnv("OPENAI_API_KEY"),
      model: getEnv("GEMINI_MODEL") || getEnv("OPENAI_MODEL") || "local fallback",
    },
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Assista AI API is running",
    routes: {
      health: "GET /health",
      auth: ["POST /api/signup", "POST /api/login"],
      profile: ["GET /api/profile", "PUT /api/profile"],
      settings: ["GET /api/settings", "PUT /api/settings"],
      chat: [
        "POST /api/chat",
        "GET /api/chat/history",
        "GET /api/chat/conversations",
        "GET /api/chat/conversations/:conversationId",
        "DELETE /api/chat/history",
      ],
    },
  });
});

app.use(async (req, res, next) => {
  app.locals.dbConnected = await dbReady;
  next();
});

app.use("/", authRoutes);
app.use("/chat", chatRoutes);
app.use("/api", authRoutes);
app.use("/api/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

if (process.env.VERCEL !== "1") {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on ${process.env.PORT || 5000}`);
    console.log(
      `AI provider: ${getEnv("AI_PROVIDER") || "auto"} | Gemini key: ${maskValue(
        getEnv("GEMINI_API_KEY") || getEnv("GOOGLE_API_KEY")
      )} | Model: ${getEnv("GEMINI_MODEL") || getEnv("OPENAI_MODEL") || "local fallback"}`
    );
  });
}

export default app;
