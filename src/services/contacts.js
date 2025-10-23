import { ContactsCollection } from '../models/contact.js';

export const getAllContactsService = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const contacts = await ContactsCollection.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  const total = await ContactsCollection.countDocuments(filter);

  return {
    contacts,
    page: Number(page),
    perPage: Number(perPage),
    total,
  };
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
