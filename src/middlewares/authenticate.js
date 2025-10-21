import createHttpError from 'http-errors';
import { Session } from '../models/Session.js';
import { isBefore } from 'date-fns';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return next(createHttpError(401, 'No access token provided'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Invalid access token'));
  }

  if (isBefore(session.accessTokenValidUntil, new Date())) {
    return next(createHttpError(401, 'Access token expired'));
  }

  req.user = { _id: session.userId };
  next();
};