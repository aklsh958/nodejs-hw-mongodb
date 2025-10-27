import multer from 'multer';
import path from 'path';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return cb(createHttpError(400, 'Only images are allowed'));
  }
  cb(null, true);
};

export const uploadSingle = (fieldName) => multer({ storage, fileFilter }).single(fieldName);
