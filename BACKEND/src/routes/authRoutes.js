import express from "express";
import { signup, login } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);

export default router;