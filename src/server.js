import pino from "pino-http";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { getEnvVar } from "./utils/getEnvVar.js";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.get("/", (req, res) => {
    res.send("✅ Server is running! Use /auth or /contacts endpoints.");
  });

  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = Number(getEnvVar("PORT", "3000"));
  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`🚀 Server is running on port ${PORT}`);
  });

  return app;
};
