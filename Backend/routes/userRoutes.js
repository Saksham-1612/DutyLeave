import express from "express";
import {
  forgotPasswordController,
  getAllUsers,
  loginController,
  registerController,
  resetPasswordController,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllUsers);

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

export default router;
