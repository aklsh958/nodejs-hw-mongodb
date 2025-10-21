import { ContactsCollection } from '../models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = (page - 1) * perPage;
  const totalItems = await ContactsCollection.countDocuments(filter);

  const contacts = await ContactsCollection.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page * perPage < totalItems,
  };
};

export const getContactById = async (id) => ContactsCollection.findById(id);
export const createContact = async (data) => ContactsCollection.create(data);
export const updateContact = async (id, data) => ContactsCollection.findByIdAndUpdate(id, data, { new: true });
export const deleteContact = async (id) => ContactsCollection.findByIdAndDelete(id);