import fs from "fs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Teachers from "../models/teacher.model.js";
import Notices from "../models/notice.model.js";
import Assignments from "../models/assignment.model.js";

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
        empId: teacherInDB.empId,
        department: teacherInDB.department,
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

export const addNewNotice = async (req, res) => {
  try {
    const { noticeNumber, noticeSubject, semester } = req.body;
    const { filename, destination } = req.file;

    //check if notice is already existing or not
    const isNoticeNumberTaken = await Notices.findOne({ noticeNumber });
    if (isNoticeNumberTaken) {
      return res.status(403).json({
        message:
          "Notice number already please change notice number and try again.",
        success: false,
      });
    }

    const fileSave = await Notices.create({
      noticeNumber,
      noticeSubject,
      semester,
      fileName: filename,
      filePath: destination,
    });

    if (!fileSave) {
      return res.status(500).json({
        message: "Error while saving the file.",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Notice uploaded successfully",
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

export const deleteNotice = async (req, res) => {
  try {
    const { _id } = req.query;
    const noticeToDelete = await Notices.findById(_id);
    if (!noticeToDelete) {
      return res.status(404).json({
        message: "The given notice was not found in database.",
        success: false,
      });
    }
    fs.unlink(
      noticeToDelete.filePath + "/" + noticeToDelete.fileName,
      (err) => {
        if (err) {
          console.log(err);
          return res.status(403).json({
            message: "Notice could not be deleted.",
            success: false,
          });
        }
      }
    );
    await Notices.deleteOne({ _id });
    return res
      .status(200)
      .json({ message: "Notice deleted successfully.", success: true });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addNewAssignment = async (req, res) => {
  try {
    const { assignmentName, subjectCode, subjectShortName, semester, section } =
      req.body;
    const { filename, destination } = req.file;
    console.log("hello i am here");

    //check if notice is already existing or not
    const isAssignmentAlreadyProvided = await Assignments.findOne({
      assignmentName,
      semester,
      subjectCode,
      semester,
      section,
    });
    if (isAssignmentAlreadyProvided) {
      return res.status(403).json({
        message:
          "Assignment already uploaded please try again later or delete the previous one.",
        success: false,
      });
    }

    const fileSave = await Assignments.create({
      assignmentName,
      subjectCode,
      subjectShortName,
      semester,
      section,
      fileName: filename,
      filePath: destination,
    });

    if (!fileSave) {
      return res.status(500).json({
        message: "Error while saving the file.",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Assignment uploaded successfully",
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
