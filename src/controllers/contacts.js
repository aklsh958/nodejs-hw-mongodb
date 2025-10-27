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
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  photo: Joi.string().optional(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
  photo: Joi.string().optional(),
});

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  uploadMiddleware.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(createContact)
);

router.patch(
  '/:contactId',
  isValidId,
  uploadMiddleware.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContact)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
