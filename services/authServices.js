import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/User.js";
import { nanoid } from "nanoid";

const { JWT_SECRET } = process.env;

export const findUser = (filter) => User.findOne({ where: filter });

export const findUserById = (id) => User.findByPk(id);

export const registerUser = async (data) => {
  const { email } = data;
  const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);
  const verificationToken = nanoid();

  return await User.create({ ...data, avatarURL, verificationToken });
};

export const loginUser = async (user) => {
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await user.update({ token });
  return token;
};

export const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.update(data);
};

export const comparePasswords = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);
