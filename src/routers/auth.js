import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema, resetPasswordSchema } from '../schemas/auth.js';

const router = express.Router();

router.post('/register', ctrlWrapper(register));
router.post('/login', ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh));
router.post('/logout', ctrlWrapper(logout));

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmail)
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword)
);

export default router;
