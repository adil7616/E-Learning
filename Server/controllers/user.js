import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middleware/sendMail.js";
import TryCatch from "../middleware/tryCatch.js";
import { User } from "../models/User.js";

export const register = TryCatch(async (req, res) => {
  const { email, name, password,role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Hash password before saving
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a user instance
  const user = new User({ name, email, password: hashPassword,role });

  // OTP and token generation
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const activationToken = jwt.sign({ user, otp }, process.env.Activation_Secret, { expiresIn: "15m" });

  // Send OTP email
  const mailData = { name, otp };
  await sendMail(email, "E-Learning Activation", mailData);

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(activationToken, process.env.Activation_Secret);
  } catch (err) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  if (decoded.otp !== otp)
    return res.status(400).json({ message: "Incorrect OTP" });

  // Create user in the database
  const user = new User({
    name: decoded.user.name,
    email: decoded.user.email,
    password: decoded.user.password,
    role: decoded.user.role,
  });

  await user.save();

  res.status(201).json({ message: "User registered successfully" });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  // Validate the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  // Generate JWT token
  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, { expiresIn: "15d" });

  res.status(200).json({
    message: `Welcome back, ${user.name}!`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate reset token
  const token = jwt.sign({ email }, process.env.FORGOT_SECRET, { expiresIn: "5m" });

  const mailData = { email, token };
  await sendForgotMail("E-Learning Password Reset", mailData);

  // Update reset expiration time in the user document
  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  res.status(200).json({ message: "Password reset link sent to your email" });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.FORGOT_SECRET);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.resetPasswordExpire < Date.now())
    return res.status(400).json({ message: "Reset token has expired" });

  // Hash and update the password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordExpire = null;

  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});
