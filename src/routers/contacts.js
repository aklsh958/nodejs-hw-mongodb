import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import Joi from 'joi';

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

router.use(authenticate);

router.get('/', ctrlWrapper(async (req, res) => {
  const contacts = await getAllContacts(req.user._id);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}));

router.get('/:contactId', isValidId, ctrlWrapper(async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user._id);
  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}));

router.post('/', validateBody(contactSchema), ctrlWrapper(async (req, res) => {
  const newContact = await createContact({ ...req.body, userId: req.user._id });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}));

router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(async (req, res) => {
  const updatedContact = await updateContact(req.params.contactId, req.body, req.user._id);
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}));

router.delete('/:contactId', isValidId, ctrlWrapper(async (req, res) => {
  await deleteContact(req.params.contactId, req.user._id);
  res.status(204).send();
}));

export default router;
