import express from "express";
import { addProgress, getYourProgress } from "../controllers/course.js";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  // resendOtp,
  resetPassword,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
// router.post("/user/resendOtp",resendOtp);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);
export default router;
