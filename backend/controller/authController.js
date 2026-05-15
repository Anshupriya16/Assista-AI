import mongoose from "mongoose";
import User from "../models/user.js";
import Chat from "../models/chat.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isDbReady = () => mongoose.connection.readyState === 1;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const supportedLanguages = ["English", "Hindi", "French"];
const supportedTones = ["Balanced", "Friendly", "Professional", "Concise"];

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  preferences: user.preferences,
  createdAt: user.createdAt,
});

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getUserStats = async (userId) => {
  const [totalChats, latestChat] = await Promise.all([
    Chat.countDocuments({ userId }),
    Chat.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
  ]);

  return {
    totalChats,
    lastChatAt: latestChat?.createdAt || null,
    status: "Online",
    plan: "Starter",
  };
};

export const signup = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);

    res.status(201).json({ message: "Signup successful", token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const stats = await getUserStats(req.user);
    res.json({ ...sanitizeUser(user), stats });
  } catch (err) {
    res.status(500).json({ message: err.message || "Unable to load profile" });
  }
};

export const updateProfile = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (name.length > 60) {
    return res.status(400).json({ message: "Name must be 60 characters or less" });
  }

  const user = await User.findByIdAndUpdate(
    req.user,
    { name },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "Profile updated", user: sanitizeUser(user) });
};

export const getSettings = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const user = await User.findById(req.user).select("preferences");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ preferences: user.preferences });
};

export const updateSettings = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const allowed = ["darkMode", "saveHistory", "language", "tone"];
  const preferences = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      preferences[`preferences.${key}`] = req.body[key];
    }
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "darkMode") && typeof req.body.darkMode !== "boolean") {
    return res.status(400).json({ message: "darkMode must be true or false" });
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "saveHistory") && typeof req.body.saveHistory !== "boolean") {
    return res.status(400).json({ message: "saveHistory must be true or false" });
  }

  if (req.body.language && !supportedLanguages.includes(req.body.language)) {
    return res.status(400).json({ message: "Unsupported language" });
  }

  if (req.body.tone && !supportedTones.includes(req.body.tone)) {
    return res.status(400).json({ message: "Unsupported tone" });
  }

  if (Object.keys(preferences).length === 0) {
    return res.status(400).json({ message: "No valid settings provided" });
  }

  const user = await User.findByIdAndUpdate(req.user, preferences, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "Settings saved", preferences: user.preferences });
};

export const getDashboard = async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database unavailable" });
  }

  const user = await User.findById(req.user).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const stats = await getUserStats(req.user);

  res.json({
    user: sanitizeUser(user),
    stats,
    quickActions: [
      { title: "Start chat", path: "/" },
      { title: "Chat history", path: "/history" },
      { title: "Settings", path: "/settings" },
    ],
  });
};
