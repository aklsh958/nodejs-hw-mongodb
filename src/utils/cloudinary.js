import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

// 🔧 Конфігурація Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * 
 * @param {string} filePath 
 * @returns {Promise<string>} 
 */
export const uploadToCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "contacts_photos",
    });

    await fs.unlink(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Не вдалося завантажити зображення на Cloudinary");
  }
};
