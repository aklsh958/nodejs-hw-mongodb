import express from "express";
import { resetPassword, setNewPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/reset-pwd", resetPassword);
router.post("/new-pwd", setNewPassword);

export default router;
