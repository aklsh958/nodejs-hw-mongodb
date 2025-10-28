import express from "express";
import { resetPasswordRequest, resetPasswordConfirm } from "../controllers/auth.js";

const router = express.Router();

router.post("/reset-pwd", resetPasswordRequest);
router.post("/reset-pwd/confirm", resetPasswordConfirm);

export default router;
