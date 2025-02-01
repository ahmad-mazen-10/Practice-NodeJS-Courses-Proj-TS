import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import httpStatus from "../utils/httpStatusText";

export const allowedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      return next(
          new AppError("You are not allowed to access this route", 403, httpStatus.ERROR)
      );
    }
  };
};
