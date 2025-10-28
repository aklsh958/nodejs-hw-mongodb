import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";

export const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, "User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.APP_DOMAIN}/auth/reset-pwd?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordConfirm = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    next(error);
  }
};
