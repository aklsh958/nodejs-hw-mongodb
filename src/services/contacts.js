import { ContactsCollection } from '../models/contact.js';

export const getAllContactsService = async (userId, skip, limit) => {
  return await ContactsCollection.find({ userId }).skip(skip).limit(limit);
};

export const getContactByIdService = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContactService = async (data) => {
  return await ContactsCollection.create(data);
};

export const updateContactService = async (contactId, userId, data) => {
  return await ContactsCollection.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
};

export const deleteContactService = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};
