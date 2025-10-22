import createHttpError from 'http-errors';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import { isBefore } from 'date-fns';

export const authenticate = async (req, res, next) => {
  try {
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

    const user = await User.findById(session.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
