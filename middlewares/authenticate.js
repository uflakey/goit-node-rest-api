import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (typeof header === "undefined") {
    next(HttpError(401, "Not authorized"));
  }
  const [bearer, token] = header.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }

    if (user.verify === false) {
      next(HttpError(401, "Your account is not verified"));
    }
    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
