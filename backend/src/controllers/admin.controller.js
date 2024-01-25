import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admins from "../models/admin.model.js";

function logOutError(error) {
  console.log("ERORR :: ");
  console.log(error);
  console.log(
    "________________________________________________________________"
  );
  console.log(error.message);
}

export const signUpAdmin = async (req, res) => {
  try {
    const { email, password, department, name, empId } = req.body;
    if (
      email === "" ||
      !email ||
      password === "" ||
      !password ||
      department === "" ||
      !department ||
      name === "" ||
      !name ||
      empId === "" ||
      !empId
    ) {
      return res.status(403).json({
        message: "All fields must be provided.",
        success: false,
      });
    }
    const isAdminExisting = await Admins.findOne({
      email,
    });
    if (isAdminExisting) {
      console.log(isAdminExisting);
      return res.status(409).json({
        message: "Admin email already exists.",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 6);
    await Admins.create({
      name,
      email,
      password: hashPassword,
      department,
      empId,
      department,
    });
    return res.status(200).json({
      message: "Admin created successfully.",
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailExisting = await Admins.findOne({ email });
    if (!isEmailExisting) {
      return res.status(404).json({
        message: "Invalid Credentials.",
        success: false,
      });
    }

    const isPasswordSame = await bcrypt.compare(
      password,
      isEmailExisting.password
    );
    if (!isPasswordSame) {
      return res.status(403).json({
        message: "Invalid Credentials.",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        name: isEmailExisting.name,
        email,
        department: isEmailExisting.email,
        userType: "Admin",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("hello", "hello world");
    return res.status(200).json({
      token,
      message: "Login successful.",
      success: true,
    });

    console.log("This is admin login api end point");
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
