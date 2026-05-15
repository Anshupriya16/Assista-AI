import express from "express";
import {
  getDashboard,
  getProfile,
  getSettings,
  login,
  signup,
  updateProfile,
  updateSettings,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", protect, getDashboard);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/dashboard", protect, getDashboard);
router.get("/auth/profile", protect, getProfile);
router.put("/auth/profile", protect, updateProfile);
router.get("/auth/settings", protect, getSettings);
router.put("/auth/settings", protect, updateSettings);

export default router;
