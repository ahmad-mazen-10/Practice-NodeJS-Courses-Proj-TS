import mongoose from "mongoose";
import validator from "validator";
import userRoles from "../utils/userRoles";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "field must be a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default:'/src/uploads/profile.jpg'
  }
});

const User = mongoose.model("User", userSchema);
export default User;
