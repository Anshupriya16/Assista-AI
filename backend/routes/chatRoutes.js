import express from "express";
import {
  clearHistory,
  getConversation,
  getHistory,
  listConversations,
  sendMessage,
} from "../controller/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/history", protect, getHistory);
router.get("/conversations", protect, listConversations);
router.get("/conversations/:conversationId", protect, getConversation);
router.delete("/history", protect, clearHistory);

export default router;
