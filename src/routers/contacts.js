import express from "express";
import { createContact, updateContact } from "../controllers/contactsController.js";
import { authenticate } from "../middlewares/authenticate.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticate, uploadMiddleware.single("photo"), createContact);
router.patch("/:contactId", authenticate, uploadMiddleware.single("photo"), updateContact);

export default router;
