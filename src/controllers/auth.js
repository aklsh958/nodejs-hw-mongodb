import createHttpError from 'http-errors';
import * as authService from '../services/auth.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser({ name, email, password });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const tokens = await authService.loginUser({ email, password });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: tokens.accessToken },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const tokens = await authService.refreshSession(refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: tokens.accessToken },
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logoutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};