import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) throw HttpError(409, "Email in use");

    const newUser = await User.create(req.body);
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
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await user.update({ token });

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await req.user.update({ token: null });
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
    const { subscription } = req.body;
    const updatedUser = await req.user.update({ subscription });

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};
