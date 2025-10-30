import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
