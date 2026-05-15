import mongoose from "mongoose";
import Chat from "../models/chat.js";
import User from "../models/user.js";

const isDbReady = () => mongoose.connection.readyState === 1;
const MAX_MESSAGE_LENGTH = 4000;
const HISTORY_LIMIT = 8;

const getEnvValue = (key) => String(process.env[key] || "").trim();

const createProviderError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const createConversationId = () =>
  `conv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const createTitle = (message) => {
  const title = message.replace(/\s+/g, " ").trim();
  return title.length > 52 ? `${title.slice(0, 49)}...` : title || "New chat";
};

const getRecentContext = async (userId, conversationId) => {
  if (!conversationId) return [];

  const chats = await Chat.find({ userId, conversationId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .select("message reply createdAt")
    .lean();

  return chats.reverse();
};

const buildSystemPrompt = (preferences) => {
  const tone = preferences?.tone || "Balanced";
  const language = preferences?.language || "English";

  return [
    `You are Assista AI, a helpful web application chatbot.`,
    `Reply in ${language}.`,
    `Use a ${tone.toLowerCase()} tone.`,
    "Be useful, clear, and practical. Ask one short follow-up question only when needed.",
  ].join(" ");
};

const buildLocalReply = (message, preferences, context = []) => {
  const tone = preferences?.tone || "Balanced";
  const language = preferences?.language || "English";
  const hasContext = context.length > 0;
  const trimmed = message.trim();

  const introByTone = {
    Concise: "Here is the short version",
    Professional: "Here is a structured response",
    Friendly: "Sure, let's work through it",
    Balanced: "Here is a helpful starting point",
  };

  const contextLine = hasContext
    ? "I also considered your recent messages in this chat."
    : "Share more details if you want me to make this more specific.";

  return [
    `Assista AI (${language}) - ${introByTone[tone] || introByTone.Balanced}:`,
    trimmed,
    "",
    contextLine,
  ].join("\n");
};

const callOpenAI = async ({ message, preferences, context }) => {
  const apiKey = getEnvValue("OPENAI_API_KEY");
  if (!apiKey) return null;

  const model = getEnvValue("OPENAI_MODEL") || "gpt-4o-mini";
  const messages = [
    { role: "system", content: buildSystemPrompt(preferences) },
    ...context.flatMap((chat) => [
      { role: "user", content: chat.message },
      { role: "assistant", content: chat.reply },
    ]),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI request failed: ${error}`);
  }

  const data = await response.json();
  return {
    reply: data.choices?.[0]?.message?.content?.trim(),
    provider: "openai",
    model,
  };
};

const callGemini = async ({ message, preferences, context }) => {
  const apiKey = getEnvValue("GEMINI_API_KEY") || getEnvValue("GOOGLE_API_KEY");
  if (!apiKey) return null;
  if (apiKey.startsWith("sk-")) {
    throw createProviderError(
      "GEMINI_API_KEY is not a Gemini key. Use a Google AI Studio key that starts with AIza...",
      500
    );
  }

  const model = getEnvValue("GEMINI_MODEL") || "gemini-2.5-flash";
  const contextText = context
    .map((chat) => `User: ${chat.message}\nAssistant: ${chat.reply}`)
    .join("\n\n");

  const prompt = [
    buildSystemPrompt(preferences),
    contextText ? `Recent chat context:\n${contextText}` : "",
    `User message:\n${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini request failed: ${error}`);
  }

  const data = await response.json();
  return {
    reply: data.candidates?.[0]?.content?.parts?.[0]?.text?.trim(),
    provider: "gemini",
    model,
  };
};

const getAssistantReply = async ({ message, preferences, context }) => {
  const preferredProvider = getEnvValue("AI_PROVIDER").toLowerCase();
  const explicitProvider = ["gemini", "openai"].includes(preferredProvider);
  const providers =
    preferredProvider === "gemini"
      ? [callGemini, callOpenAI]
      : preferredProvider === "openai"
        ? [callOpenAI, callGemini]
        : [callOpenAI, callGemini];

  for (const provider of providers) {
    try {
      const result = await provider({ message, preferences, context });
      if (result?.reply) return result;
    } catch (err) {
      console.error(err.message || err);
      if (explicitProvider || getEnvValue("AI_DEBUG") === "true") {
        throw err;
      }
    }
  }

  if (explicitProvider) {
    const keyName = preferredProvider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY";
    throw createProviderError(`${keyName} is missing or invalid. Add it in backend/.env and restart the backend.`);
  }

  return {
    reply: buildLocalReply(message, preferences, context),
    provider: "local",
    model: "assista-local",
  };
};

export const sendMessage = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const message = String(req.body.message || "").trim();
  const requestedConversationId = String(req.body.conversationId || "").trim();

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` });
  }

  const user = await User.findById(req.user).select("preferences");
  if (!user) return res.status(404).json({ message: "User not found" });

  const conversationId = requestedConversationId || createConversationId();
  const context = await getRecentContext(req.user, requestedConversationId);
  let aiResult;
  try {
    aiResult = await getAssistantReply({
      message,
      preferences: user.preferences,
      context,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "AI provider failed. Please check your API key and model.",
    });
  }

  if (user.preferences?.saveHistory === false) {
    return res.json({
      id: null,
      _id: null,
      conversationId,
      title: createTitle(message),
      message,
      reply: aiResult.reply,
      provider: aiResult.provider,
      model: aiResult.model,
      saved: false,
      createdAt: new Date().toISOString(),
    });
  }

  const existingChat = requestedConversationId
    ? await Chat.findOne({ userId: req.user, conversationId: requestedConversationId }).select("title")
    : null;

  const chat = await Chat.create({
    userId: req.user,
    conversationId,
    title: existingChat?.title || createTitle(message),
    message,
    reply: aiResult.reply,
    provider: aiResult.provider,
    model: aiResult.model,
  });

  res.status(201).json({ ...chat.toObject(), saved: true });
};

export const getHistory = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const chats = await Chat.find({ userId: req.user }).sort({ createdAt: -1 });
  res.json(chats);
};

export const getConversation = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const conversationId = String(req.params.conversationId || "").trim();
  if (!conversationId) {
    return res.status(400).json({ message: "Conversation id is required" });
  }

  const chats = await Chat.find({ userId: req.user, conversationId }).sort({ createdAt: 1 });
  res.json(chats);
};

export const listConversations = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const conversations = await Chat.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$conversationId",
        title: { $first: "$title" },
        lastMessage: { $first: "$message" },
        lastReply: { $first: "$reply" },
        updatedAt: { $first: "$createdAt" },
        messageCount: { $sum: 1 },
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);

  res.json(
    conversations.map((conversation) => ({
      conversationId: conversation._id,
      title: conversation.title,
      lastMessage: conversation.lastMessage,
      lastReply: conversation.lastReply,
      updatedAt: conversation.updatedAt,
      messageCount: conversation.messageCount,
    }))
  );
};

export const clearHistory = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const result = await Chat.deleteMany({ userId: req.user });
  res.json({ message: "Chat history cleared", deletedCount: result.deletedCount });
};
