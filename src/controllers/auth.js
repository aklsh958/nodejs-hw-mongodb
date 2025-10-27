import createHttpError from 'http-errors'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as authService from '../services/auth.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/email.js';
import { User } from '../models/User.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser({ name, email, password });
  res.status(201).json({ status: 201, message: 'Successfully registered a user!', data: user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, session } = await authService.loginUser({ email, password });

  res.cookie('sessionId', session._id, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*24*60*60*1000 });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*24*60*60*1000 });

  res.status(200).json({ status: 200, message: 'Successfully logged in a user!', data: { accessToken } });
};

export const refresh = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const tokens = await authService.refreshSession(refreshToken, sessionId);

  res.cookie('sessionId', tokens.session._id, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*24*60*60*1000 });
  res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*24*60*60*1000 });

  res.status(200).json({ status: 200, message: 'Successfully refreshed a session!', data: { accessToken: tokens.accessToken } });
};

export const logout = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  await authService.logoutUser(refreshToken, sessionId);
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const token = jwt.sign({ email }, getEnvVar('JWT_SECRET'), { expiresIn: '5m' });
  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${token}`;

  const html = `<p>Hi ${user.name || 'there'},</p><p>Click the link below to reset your password (valid for 5 minutes):</p><a href="${resetLink}">${resetLink}</a>`;
  await sendEmail(email, 'Reset your password', html);

  res.status(200).json({ status: 200, message: 'Reset password email has been successfully sent.', data: {} });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await authService.logoutAllUserSessions(user._id);

  res.status(200).json({ status: 200, message: 'Password has been successfully reset.', data: {} });
};
