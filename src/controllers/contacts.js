import createHttpError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20 } = req.query || {};
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const { _id: userId } = req.user;

  const contacts = await getAllContactsService(userId, skip, limitNumber);

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
    pagination: { page: pageNumber, limit: limitNumber, count: contacts.length },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await getContactByIdService(contactId, userId);
  if (!contact) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { _id: userId } = req.user;
  const newContact = await createContactService({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const updated = await updateContactService(contactId, userId, req.body);

  if (!updated) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updated,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const deleted = await deleteContactService(contactId, userId);

  if (!deleted) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
