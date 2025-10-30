import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { randomUUID } from "crypto";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const sessionId = randomUUID();

  const accessToken = jwt.sign({ id: user._id, sessionId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id, sessionId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.sessionId = sessionId;
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken, sessionId };
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
      { id: user._id, sessionId: user.sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, sessionId: user.sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logoutUser = async (sessionId) => {
  await User.updateOne({ sessionId }, { $unset: { sessionId: "", refreshToken: "" } });
};

export const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  });
};

export const resetPasswordService = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
};
