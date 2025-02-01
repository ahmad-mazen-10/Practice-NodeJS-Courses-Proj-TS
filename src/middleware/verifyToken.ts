import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import httpStatus from "../utils/httpStatusText";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    const error = new AppError("token is require", 401, httpStatus.ERROR);
    return next(error);
  }

    const token = (typeof authHeader === 'string' ? authHeader : authHeader[0]).split(" ")[1];

  if (!token) {
    const error = new AppError("token is require", 401, httpStatus.ERROR);
    return next(error);
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    const error = new AppError("Secret key not defined", 500, "error");
    return next(error);
  }

  try {
    const currentUser = jwt.verify(token, secretKey) as JwtPayload;
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = new AppError("invalid token", 401, httpStatus.ERROR);
    return next(error);
  }
};

export default verifyToken;
