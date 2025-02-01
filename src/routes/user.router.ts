const router = express.Router();
import express from "express";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import verifyToken from "./../middleware/verifyToken";
import usersController from "../controllers/users.controller";

const diskStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) {
    cb(null, "uploads/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });


router.route("/").get(verifyToken, usersController.getAllUsers);
router.route("/login").post(usersController.login);
router
.route("/register")
  .post(upload.single("avatar"), usersController.register);

export default router;
