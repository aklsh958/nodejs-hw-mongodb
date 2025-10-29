import { Contact } from "../models/contact.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;

    let photoUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      photoUrl = uploadResult.secure_url; 
    }

    const contact = await Contact.create({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      photo: photoUrl,
      userId,
    });

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    let photoUrl = req.body.photo;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      photoUrl = uploadResult.secure_url;
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { ...req.body, photo: photoUrl },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
