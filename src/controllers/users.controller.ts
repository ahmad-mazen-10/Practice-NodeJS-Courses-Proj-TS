import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces/irequest";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import asyncWrapper from "../middleware/asyncWrapper";
import generateJWT from "../utils/generateJWT";
import AppError from "../utils/appError";
import httpStatus from "../utils/httpStatusText";


const getAllUsers = asyncWrapper(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const query = req.query;
    const limit = query.limit || 6;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    console.log(query);

    // get all course from db by course model
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit)
      .skip(skip); // .find({price :500}) , // .find({price : { $gt: 500 }})  , //{'__v':false, 'price':false} ==> want hidden any thing in API
    res.json({ status: httpStatus.SUCCESS, data: { users } });
  }
);

const register = async (req:Request, res:Response, next:NextFunction) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = new AppError ("User already exits", 404, httpStatus.FAIL);
    return next(error);
  }

  //hashing password
  const hasedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hasedPassword,
    role,
  });

  //generate JWT token
  const token = await generateJWT({ email: newUser.email, id: newUser.id ,role:newUser.role });
  newUser.token = token;

  await newUser.save();
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { user: newUser },
    message: "User created successfully",
  });
};

const login = asyncWrapper(async (req: Request, res: Response, next: Function) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new AppError("Invalid email or password", 404, httpStatus.FAIL);
    return next(error);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    const error =new AppError("User not found ", 404, httpStatus.FAIL);
    return next(error);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new AppError(
      "Invalid email or password",
      404,
      httpStatus.FAIL
    );
    return next(error);
  }

  const token = await generateJWT({ email: user.email, id: user.id, role: user.role });
  user.token = token;

  res.json({ status: httpStatus.SUCCESS, data: { token } });

});

export default {
  getAllUsers,
  register,
  login,
};