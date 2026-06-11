import { Router } from "express";
import {
  getMe,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middewares/auth.middleware.js";

const authRouter = Router();

authRouter
  .post("/register", registerValidator, register)
  .get("/verify-email", verifyEmail)
  .post("/login", loginValidator, login)
  .get("/get-me", authUser, getMe)
  .get("/logout", authUser, logout);

export default authRouter;
