import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

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
