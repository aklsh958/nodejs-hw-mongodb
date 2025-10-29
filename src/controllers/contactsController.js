import createHttpError from "http-errors";
import { Contact } from "../models/contact.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, contactType } = req.body;
    const owner = req.user._id;

    let photoUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      photoUrl = uploadResult.secure_url; 
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      contactType,
      photo: photoUrl,
      owner,
    });

    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone, contactType } = req.body;

    let updatedData = { name, email, phone, contactType };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      updatedData.photo = uploadResult.secure_url; 
    }

    const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, {
      new: true,
    });

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
