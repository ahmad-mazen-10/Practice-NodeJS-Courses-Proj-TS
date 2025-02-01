
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import Course from "../models/course.model"; // Use ES6 import for TypeScript
import httpStatus from "../utils/httpStatusText"; // Use ES6 import for TypeScript
import asyncWrapper from "../middleware/asyncWrapper"; // Use ES6 import for TypeScript
import appError from "../utils/appError";
import { IRequest } from "../interfaces/irequest";
import AppError from "../utils/appError";

const getAllCourses = asyncWrapper(async (req: IRequest, res: Response) => {
  const query = req.query;
  const limit = query.limit || 6;
  const page = query.page || 1;
  const skip = (+page - 1) * limit;
  console.log(query);

  // get all course from db by course model
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip); // .find({price :500}) , // .find({price : { $gt: 500 }})  , //{'__v':false, 'price':false} ==> want hidden any thing in API
  res.json({ status: httpStatus.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(
  async (req: Request, res: Response, next: Function) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      const error = new appError("course not found", 404, httpStatus.FAIL);
      return next(error);
      // res.status(404).json({ status: httpStatus.FAIL, data: "course not found " })
    }
    return res.json({ status: httpStatus.SUCCESS, data: { course } });

    //   try {
    // } catch (error) {
    //   return res.status(400).json({ status: httpStatus.ERROR, data: null, message: error.message, code: 400,
    //   });
    // }
  }
);

const createCourse = asyncWrapper(
  async (req: Request, res: Response, next: Function) => {
    //  ( !req.body.name)
    //     ? res.status(400).json({ error: "name is required" })
    //         : courses.push({ id: courses.length + 1, ...req.body });

    //  ( !req.body.price)
    //     ? res.status(400).json({ error: "price is required" })
    //         : courses.push({ id: courses.length + 1, ...req.body });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new AppError(JSON.stringify(errors.array()), 400, httpStatus.ERROR);
      return next(error);

      // return res.status(400).json({ status: httpStatus.FAIL, data: errors.array() });
    }

    // const course = { id: courses.length + 1, ...req.body };
    // courses.push(course);

    const newCourse = new Course(req.body);
    await newCourse.save();

    res.status(201).json({ status: httpStatus.SUCCESS, data: { newCourse } });
  }
);

const updateCourse = asyncWrapper(async (req: Request, res: Response) => {
  const courseId = req.params.courseId;
  // let course = courses.find((course) => course.id === courseId);
  const updatedCourse = await Course.updateOne({ _id: courseId }, {
    $set: { ...req.body },
  });
  res
    .status(201)
    .json({ status: httpStatus.SUCCESS, data: { course: updatedCourse } });

  // course = { ...course, ...req.body };
  //     try {
  // } catch (error) {
  //   return res
  //     .status(400)
  //     .json({ status: httpStatus.ERROR, data: error.message });
  // }
});

const deleteCourse = asyncWrapper(async (req: Request, res: Response) => {
  const courseId = +req.params.courseId;
  const deletedCourse = await Course.deleteOne({ id: courseId }); // courses = courses.filter((course) => course.id !== courseId);
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
