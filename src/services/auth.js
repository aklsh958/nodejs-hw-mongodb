import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import { addMinutes, addDays, isBefore } from 'date-fns';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const accessToken = uuid();
  const refreshToken = uuid();

  const accessTokenValidUntil = addMinutes(new Date(), 15);
  const refreshTokenValidUntil = addDays(new Date(), 30);

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, session };
};

export const refreshSession = async (refreshToken, sessionId) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  if (isBefore(session.refreshTokenValidUntil, new Date())) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = uuid();
  const newRefreshToken = uuid();

  const accessTokenValidUntil = addMinutes(new Date(), 15);
  const refreshTokenValidUntil = addDays(new Date(), 30);

  const newSession = await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken: newRefreshToken, session: newSession };
};

export const logoutUser = async (refreshToken, sessionId) => {
  await Session.deleteOne({ _id: sessionId, refreshToken });
};
