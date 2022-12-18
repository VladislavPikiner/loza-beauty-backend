import LoginSchema from "../models/Login.js";
import jwt from "jsonwebtoken";
import { secretKey } from "../config/secret.js";
import bcrypt from "bcrypt";

export const generateAccessToken = (login, password) => {
  const payload = {
    login,
    password,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

export const getAllAdmins = async (req, res) => {
  try {
    const users = await LoginSchema.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Користувачів не знайдено" });
  }
};

export const register = async (req, res) => {
  try {
    const user = await LoginSchema.findOne({ login: req.body.login });

    if (user) {
      return res
        .status(400)
        .json({ message: "Такого користувача вже зареєстровано" });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 7);
    console.log(hashPassword);
    const { login, password, superAdmin } = req.body;
    const token = generateAccessToken(login, password);

    const doc = new LoginSchema({
      login,
      password: hashPassword,
      superAdmin,
      token,
    });

    await doc.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать admina",
    });
  }
};

export const login = async (req, res) => {
  const { login, password } = req.body;
  const user = await LoginSchema.findOne({ login });

  if (!user) {
    return res.status(400).json({
      message: "Неправильный login or password",
    });
  }

  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    return res.status(400).json({
      message: "Неправильный login or password",
    });
  }

  const token = `Bearer ${generateAccessToken(login, password)}`;

  return res.json({
    token,
  });
};
