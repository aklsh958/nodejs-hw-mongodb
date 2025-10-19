import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactsCollection.find();

export const getContactById = (id) => ContactsCollection.findById(id);

export const createContact = (data) => ContactsCollection.create(data);

export const updateContact = (id, data) =>
  ContactsCollection.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => ContactsCollection.findByIdAndDelete(id);
