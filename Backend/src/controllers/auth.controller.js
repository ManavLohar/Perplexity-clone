import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
  const { email, username, password } = req.body;

  const isUserAlreadyExist = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User with this email or username already exist!",
      success: false,
      err: "User already exist!",
    });
  }

  const user = await UserModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    // text: `Hy ${username},\n\nThank you for registering at Perplexity. We're excited to have you on board!\n\nBest regards,\nThe Perplexity Team`,
    html: `
            <p>Hi ${username},</p>
            <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>If you did not create an account, please ignore!</p>
            <p>Best regards,<br>The Perplexity Team</p>
    `,
  });

  res.status(201).json({
    message: "User registered successfully!",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token!",
        success: false,
        err: "User not found!",
      });
    }

    user.verified = true;
    await user.save();

    res.send(`
        <h1>Email Verified Successfully</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: error.message,
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password!",
      success: false,
      err: "User not found!",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password!",
      success: false,
      err: "Incorrect password!",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in!",
      success: false,
      err: "Email not verified!",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successfully!",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const { email } = req.user;

  const user = await UserModel.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found!",
      success: false,
      err: "User not exist!",
    });
  }

  return res.status(200).json({
    message: "User fetched successfully!",
    success: true,
    user,
  });
}

export async function logout(req, res) {
  const { email } = req.user;
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successfully!",
    success: true,
  });
}
