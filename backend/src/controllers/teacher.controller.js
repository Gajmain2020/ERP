import bcrypt from "bcrypt";

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
