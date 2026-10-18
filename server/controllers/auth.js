import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
// Gmail SMTP: EMAIL_FROM is the Gmail address, EMAIL_APP_PASSWORD its app password.
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_APP_PASSWORD },
});
export const register = async (req, res) => {
  try {
    //console.log(req.body);
    const { name, email, password } = req.body;
    //validation
    if (!name) return res.status(400).send("Name is required");
    
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    //console.log("saved user",user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error.Try again.");
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json(user);
    //console.log(req.body);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signedout success" });
  } catch (err) {
    console.log(err);
  }
};
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //console.log("email");
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");
    await mailer.sendMail({
      from: `LMS <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Password",
      html: `
        <html>
        <h1>Reset password</h1>
        <p>Use this code to reset your password</p>
        <h2 style = "color:red;">${shortCode}</h2>
        </html>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Could not send the reset email. Try again.");
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({email,code,newPassword});
    const hashedPassword = await hashPassword(newPassword);
    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error!Try again.");
  }
};
