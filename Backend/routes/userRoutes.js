import express from "express";
import {
  forgotPasswordController,
  getAllFaculty,
  getAllUsers,
  getSingleUser,
  loginController,
  registerController,
  resetPasswordController,
  updateRoleController,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-user/:id", getSingleUser);

router.get("/faculty", protect, getAllFaculty);

router.get("/attendees", protect, getAllUsers);

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

router.put("/update-role", protect, updateRoleController);

export default router;
