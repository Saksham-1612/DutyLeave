import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import { sendPasswordResetEmail } from "../services/emailService.js";
import mongoose from "mongoose";

export const registerController = async (req, res) => {
  try {
    const { name, reg, email, password } = req.body;

    if (!name || !reg || !email || !password) {
      return res.send({ message: "All the fields are mandatory!" });
    }

    const existingUser = await userModel.findOne({ reg });

    if (existingUser) {
      res.status(400).send({
        success: false,
        message: "Registration No. is already registered! Try to login!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      reg,
      email,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "User registered!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration!",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { reg, password } = req.body;

    if (!reg || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid registration No. or password!",
      });
    }

    const user = await userModel.findOne({ reg });
    console.log(user);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found!",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).send({
      success: true,
      message: `${user.reg} logged in!`,
      user: {
        _id: user._id,
        name: user.name,
        reg: user.reg,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in logim",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered!",
      });
    }

    const resetToken = JWT.sign(
      { _id: user._id },
      process.env.RESET_PASSWORD_KEY,
      {
        expiresIn: "1h",
      }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // Define your frontend reset password link
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).send({
      success: true,
      message:
        "A password reset link has been sent to your email! Please ckeck your email!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in password reset request!",
      error,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email is not registered!",
      });
    }

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in password reset!",
      error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { reg: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
        role: "student",
      }
    : { role: "student" };

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
};

export const getAllFaculty = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { reg: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
        role: "faculty",
      }
    : { role: "faculty" };

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
};

export const getSingleUser = async (req, res) => {
  try {
    const userD = await userModel.findById(req.params.id).select("-password");
    if (!userD) {
      return res.status(404).send({
        success: false,
        message: "Error!",
      });
    }
    res.status(200).send({
      success: true,
      message: "User fetched successfully!",
      userD,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching user!",
      error,
    });
  }
};

export const updateRoleController = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found!",
      });
    }
    console.log(user);
    if (user.role !== "SuperAdmin") {
      return res.status(403).send({ msg: "Unauthorized access" });
    }
    // registration of user to update role
    // role to be done
    const { reg, role } = req.body;
    console.log(reg, role);
    const userToBeUpdated = await userModel.findOne({ reg: reg });
    console.log(userToBeUpdated);
    if (!userToBeUpdated) {
      return res.status(404).send({
        success: false,
        message: "User to be updated not found",
      });
    }
    userToBeUpdated.role = role;
    await userToBeUpdated.save();

    return res.status(200).send({ msg: "User Role updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Error updating user", error: error });
  }
};
