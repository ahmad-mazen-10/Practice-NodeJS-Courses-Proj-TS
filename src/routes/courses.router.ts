import { allowedTo } from "../middleware/allowedTo";
import userRoles from "../utils/userRoles";

const express = require("express");
const router = express.Router();

const courseController = require("../src/controllers/courses.controller");
const { validationSchema } = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verifyToken");

router
  .route("/api/courses/")
  .get(courseController.getAllCourses)
  .post(verifyToken, validationSchema(), courseController.createCourse);

router
  .route("/api/courses/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    courseController.deleteCourse
  );

export default router;

// router.get("/api/courses", courseController.getAllCourses);
// router.get(`/api/courses/:courseId`, courseController.getCourse);
// router.post(
//   "/api/courses",
//   [
//     body("name")
//       .notEmpty()
//       .withMessage("name is required")
//       .isLength({ min: 4 })
//       .withMessage("name at least 2 char"),
//     body("price").notEmpty().withMessage("price is required"),
//   ],
//   courseController.creatCourse
// );
// router.patch("/api/courses/:courseId", courseController.updateCourse);
// router.delete("/api/courses/:courseId", courseController.deleteCourse);
