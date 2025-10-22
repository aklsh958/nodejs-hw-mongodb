import { Contact } from '../models/contact.js';
import createHttpError from 'http-errors';

export const getAllContacts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'User not authenticated');
    }
    const { _id: userId } = req.user;

    const pageNumber = parseInt(req.query?.page || '1', 10);
    const limitNumber = parseInt(req.query?.limit || '20', 10);
    const skip = (pageNumber - 1) * limitNumber;

    const contacts = await Contact.find({ userId })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        count: contacts.length,
      },
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(error.status || 500, error.message || 'Error fetching contacts');
  }
};
