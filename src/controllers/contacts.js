import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const { _id: userId } = req.user;

  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const contactsData = await contactsService.getAllContactsService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await contactsService.getContactByIdService(contactId, userId);
  if (!contact) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully fetched contact!',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { _id: userId } = req.user;
  const newContact = await contactsService.createContactService({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const updated = await contactsService.updateContactService(contactId, userId, req.body);
  if (!updated) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const deleted = await contactsService.deleteContactService(contactId, userId);
  if (!deleted) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
