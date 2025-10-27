import nodemailer from "nodemailer";
import { getEnvVar } from "./getEnvVar.js";

const transport = nodemailer.createTransport({
  host: getEnvVar("SMTP_HOST"),
  port: getEnvVar("SMTP_PORT"),
  auth: {
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASSWORD"),
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transport.sendMail({
      from: getEnvVar("SMTP_FROM"),
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send the email, please try again later.");
  }
};
