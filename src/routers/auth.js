import express from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh", refreshController);

router.post("/logout", logoutController);

router.post("/send-reset-email", sendResetEmailController);

export default router;
