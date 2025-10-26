import multer from "multer";
import path from "path";
import fs from "fs/promises";

const tempDir = path.resolve("temp");
await fs.mkdir(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
