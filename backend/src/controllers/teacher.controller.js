import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Teachers from "../models/teacher.model.js";

function logOutError(error) {
  console.log("ERROR:::");
  console.log(error);
  console.log("______________________________________________");
  console.log(error.message);
}

export const registerSingleTeacher = async (req, res) => {
  try {
    const { name, department, email, empId, phoneNumber } = req.body;

    if (
      name === "" ||
      department === "" ||
      email === "" ||
      empId === "" ||
      phoneNumber === ""
    ) {
      return res.status(409).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const isTeacherExisting = await Teachers.findOne({
      $or: [{ email }, { empId }],
    });
    if (isTeacherExisting) {
      return res.status(409).json({
        message: "Teacher with given email or employee id already exists.",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(email, 10);

    await Teachers.create({
      name,
      email,
      phoneNumber,
      password: hashPassword,
      department,
      empId,
    });

    return res.status(201).json({
      message: "Teacher registered successfully.",
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

export const registerMultipleTeachers = async (req, res) => {
  try {
    const accepted = [];
    const rejected = [];
    const teachers = req.body.teachers;

    for (let i = 0; i < teachers.length; i++) {
      const { name, email, department, empId, phoneNumber } = teachers[i];

      if (
        name === "" ||
        email === "" ||
        phoneNumber === "" ||
        department === "" ||
        empId === ""
      ) {
        rejected.push(teachers[i]);
        continue;
      }

      const isTeacherExisting = await Teachers.findOne({
        $or: [{ email }, { empId }],
      });
      if (isTeacherExisting) {
        rejected.push(teachers[i]);
        continue;
      }

      const password = await bcrypt.hash(email, 10);
      await Teachers.create({
        name,
        email,
        empId,
        department,
        phoneNumber,
        password,
      });
      accepted.push(teachers[i]);
    }
    return res.status(201).json({
      message: `Out of ${teachers.length} teachers ${accepted.length} are added successfully and ${rejected.length} are rejected.`,
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

export const deleteSingleTeacher = async (req, res) => {
  try {
    const query = req.query;

    const teacherDeleted = await Teachers.findByIdAndDelete(query._id);
    if (!teacherDeleted) {
      return res.status(404).json({
        message: "Teacher with given id does not exist.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Teacher deleted successfully.",
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

export const deleteMultipleTeachers = async (req, res) => {
  try {
    const deleted = [];
    const notDeleted = [];

    const teachers = req.body.teachers;

    for (let i = 0; i < teachers.length; i++) {
      const { id } = teachers[i];
      const deletedTeacher = await Teachers.findByIdAndDelete(id);
      if (!deletedTeacher) {
        notDeleted.push(teachers[i]);
        continue;
      }
      deleted.push(teachers[i]);
    }
    return res.status(200).json({
      message: `Out of ${teachers.length} teachers ${deleted.length} has been deleted and ${notDeleted.length} can not be deleted`,
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

export const fetchAllTeachers = async (req, res) => {
  try {
    const teachers = await Teachers.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "Teachers sent successfully.",
      data: {
        teachers,
      },
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchTeachersByDepartment = async (req, res) => {
  try {
    const { department } = req.query;

    const teachers = await Teachers.find({
      department,
    });
    return res.status(200).json({
      message: "Teachers sent successfully.",
      success: true,
      data: {
        teachers,
      },
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacherInDB = await Teachers.findOne({
      email,
    });

    if (!teacherInDB) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordSame = await bcrypt.compare(password, teacherInDB.password);

    if (!isPasswordSame) {
      return res.status(409).json({
        message: "Invalid credentials.",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Loged in successfully.",
      data: {
        id: teacherInDB._id,
        urn: teacherInDB.urn,
        authToken: jwt.sign(
          {
            ...teacherInDB,
            usertype: "teacher",
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        ),
      },
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
