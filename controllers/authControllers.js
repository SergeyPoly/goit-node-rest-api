import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import fs from "node:fs/promises";
import path from "node:path";
import { Jimp } from "jimp";
import sendEmail from "../helpers/sendEmail.js";

const avatarsDir = path.resolve("public", "avatars");
const { BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUser({ email });
    if (user) throw HttpError(409, "Email in use");

    const newUser = await authService.registerUser(req.body);

    const verificationEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${newUser.verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verificationEmail);

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUser({ email });

    if (!user || !(await authService.comparePasswords(password, user.password))) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const token = await authService.loginUser(user);
    res.json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.updateUser(req.user.id, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

export const updateSubscription = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUser(req.user.id, req.body);
    res.json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "File is required");

    const { id: userId } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const filename = `${userId}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    image.resize({ w: 250, h: 250 });
    await image.write(tempUpload);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = `/avatars/${filename}`;
    await authService.updateUser(userId, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await authService.findUser({ verificationToken });

    if (!user) throw HttpError(404, "User not found");

    await authService.updateUser(user.id, {
      verify: true,
      verificationToken: null,
    });

    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUser({ email });

    if (!user) throw HttpError(404, "User not found");
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verificationEmail);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
