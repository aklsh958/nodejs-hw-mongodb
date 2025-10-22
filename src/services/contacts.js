import { Contact } from '../models/contact.js';

export const getAllContactsService = async (userId, skip, limit) => {
  return await Contact.find({ userId }).skip(skip).limit(limit);
};

export const getContactByIdService = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContactService = async (data) => {
  return await Contact.create(data);
};

export const updateContactService = async (contactId, userId, data) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
};

export const deleteContactService = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
