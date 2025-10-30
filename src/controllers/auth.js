import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  sendResetEmailService,
  resetPasswordService,
} from "../services/auth.js";

export const registerController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({ user: { id: newUser._id, email: newUser.email } });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, sessionId } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ accessToken, user: { id: user._id, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const tokens = await refreshTokens(refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    await logoutUser(sessionId);

    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    await sendResetEmailService(req.body.email);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
