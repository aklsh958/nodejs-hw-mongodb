import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar('CLOUD_NAME'),
  api_key: getEnvVar('CLOUD_API_KEY'),
  api_secret: getEnvVar('CLOUD_API_SECRET'),
});

export const uploadToCloudinary = async (buffer, folder = 'contacts') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result); 
    });
    stream.end(buffer);
  });
};
