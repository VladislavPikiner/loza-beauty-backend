import jwt from "jsonwebtoken";
import { secretKey } from "./config/secret.js";

export default (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.json({
        message: "Token is not correct",
      });
    }

    jwt.verify(token, secretKey);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Користувач не авторизований",
    });
  }
};
