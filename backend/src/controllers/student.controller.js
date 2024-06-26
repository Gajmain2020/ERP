import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import imageToBase64 from "image-to-base64";

import Students from "../models/student.model.js";
import TGs from "../models/teacherGuardian.model.js";
import StudentDetails from "../models/studentDetails.model.js";
import TimeTableMap from "../models/timeTableMap.model.js";
import TimeTable from "../models/timeTable.model.js";
import Assignments from "../models/assignment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

function logOutError(error) {
  console.log("ERROR:::");
  console.log(error);
  console.log("______________________________________________");
  console.log(error.message);
}

export const registerSingleStudent = asyncHandler(async (req, res) => {
  const { name, email, department, urn, crn, semester, section } = req.body;
  if (
    name === "" ||
    email === "" ||
    department === "" ||
    urn === "" ||
    crn === "" ||
    semester === "" ||
    section === ""
  ) {
    return res.status(404).json({
      message: "All fields must be filled.",
      success: false,
    });
  }

  const isStudentAlreadyExisting = await Students.findOne({
    $or: [{ name }, { urn }],
  });

  if (isStudentAlreadyExisting) {
    return res.status(409).json({
      message: "Given URN and email already exists in the database.",
      success: false,
    });
  }

  const hashPassword = await bcrypt.hash(email, 10);

  await Students.create({
    name,
    department,
    email,
    crn: section + "-" + crn,
    urn,
    password: hashPassword,
    semester,
    section,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, "Student registered Successfully."));
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  if (email === undefined || email === "" || password === undefined) {
    return res
      .status(403)
      .json({ message: "Email & Password must be provided.", success: false });
  }

  const student = await Students.findOne({ email });

  console.log(email, password);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials. Please try again.",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, student.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Invalid password. Please try again.",
      success: false,
    });
  }

  const token = jwt.sign(
    {
      name: student.name,
      department: student.department,
      urn: student.urn,
      crn: student.crn,
      email: student.email,
      TG: student.TG,
      id: student._id,
      isDetailsFilled: student.isDetailsFilled,
      isVerified: student.isVerified,
      section: student.section,
      semester: student.semester,
      userType: "student",
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return res.status(200).json({
    message: "Login successful.",
    success: true,
    id: student._id,
    urn: student.urn,
    department: student.department,
    isVerified: student?.isVerified || false,
    isDetailsFilled: student?.isDetailsFilled || false,
    authToken: token,
  });
});

export const getStudentBasicDetails = async (req, res) => {
  try {
    const query = req.query;

    const student = await Students.findById(query._id);

    if (!student) {
      res.status(404).json({
        message: "Student with given id is not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Student details sent successfully.",
      success: true,
      data: {
        details: student,
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

export const getStudentDetails = async (req, res) => {
  try {
    const query = req.query;

    const studentInDB = await Students.findById(query.studentId).select(
      "name urn email department crn section semester"
    );

    delete studentInDB._id;

    const studentDetails = await StudentDetails.findOne({
      studentId: query.studentId,
    });

    if (!studentDetails) {
      return res.status(404).json({
        message: "Student details with given id is not found.",
        success: false,
      });
    }

    const dataToSend = {
      permanentAddress: studentDetails.permanentAddress,
      studentId: studentDetails.studentId,
      studentUrn: studentDetails.studentUrn,
      dob: studentDetails.dob,
      bloodGroup: studentDetails.bloodGroup,
      admissionNumber: studentDetails.admissionNumber,
      gender: studentDetails.gender,
      studentMobileNumber: studentDetails.studentMobileNumber,
      motherName: studentDetails.motherName,
      motherMobileNumber: studentDetails.motherMobileNumber,
      fatherName: studentDetails.fatherName,
      fatherMobileNumber: studentDetails.fatherMobileNumber,
      aadharNumber: studentDetails.aadharNumber,
      category: studentDetails.category,
      name: studentInDB.name,
      department: studentInDB.department,
      semester: studentInDB.semester,
      crn: studentInDB.crn,
      section: studentInDB.section,
      urn: studentInDB.urn,
      email: studentInDB.email,
    };

    const imagesDirectory = path.dirname(
      studentDetails.profilePhoto.destination + `/$student_profile_photo`
    );

    const image = await imageToBase64(
      imagesDirectory + "/" + studentDetails.profilePhoto.fileName
    );

    return res.status(200).json({
      message: "Student details sent successfully.",
      success: true,
      image,
      details: dataToSend,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const saveStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.query;
    const { filename, destination } = req.file;
    const {
      dob,
      bloodGroup,
      admissionNumber,
      gender,
      mobileNumber,
      motherName,
      motherMobileNumber,
      fatherName,
      fatherMobileNumber,
      aadharNumber,
      category,
      pinCode,
      state,
      address,
    } = JSON.parse(req.body.details);

    const studentInDB = await Students.findById(studentId).select(
      "-password -attendance"
    );

    if (!studentInDB) {
      return res.status(500).json({
        message: "Student not found. Please try again.",
        success: false,
      });
    }

    if (studentInDB.isDetailsFilled) {
      return res.status(401).json({
        message: "Student details already filled.",
        success: false,
      });
    }

    studentInDB.isDetailsFilled = true;

    await studentInDB.save();

    await StudentDetails.create({
      studentId: studentInDB._id,
      studentUrn: studentInDB.urn,

      dob: new Date(dob),
      bloodGroup,
      admissionNumber,
      gender,
      studentMobileNumber: mobileNumber,
      motherName,
      motherMobileNumber,
      fatherName,
      fatherMobileNumber,
      aadharNumber,
      category,
      permanentAddress: { pinCode, state, address },
      profilePhoto: { fileName: filename, destination },
    });

    if (studentInDB.TG) {
      const tgInDB = await TGs.findOne({ teacherId: studentInDB.TG.teacherId });
      tgInDB.studentsUnderTG = tgInDB.studentsUnderTG.map((stu) => {
        if (stu.urn === studentInDB.urn) {
          return { ...stu, isDetailsFilled: true };
        }
        return stu;
      });
      await tgInDB.save();
    }

    const token = jwt.sign(
      {
        name: studentInDB.name,
        department: studentInDB.department,
        urn: studentInDB.urn,
        crn: studentInDB.crn,
        email: studentInDB.email,
        TG: studentInDB.TG,
        id: studentInDB._id,
        isDetailsFilled: true,
        isVerified: studentInDB.isVerified,
        section: studentInDB.section,
        semester: studentInDB.semester,
        userType: "student",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      message: "Student details uploaded successfully.",
      success: true,
      authToken: token,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const editStudentDetails = async (req, res) => {
  try {
    const query = req.query;

    const {
      dob,
      bloodGroup,
      admissionNumber,
      gender,
      studentMobileNumber,
      motherName,
      motherMobileNumber,
      fatherName,
      fatherMobileNumber,
      aadharNumber,
      category,
      permanentAddress,
      profilePhoto,
    } = req.body;

    const studentDetails = await StudentDetails.findOneAndUpdate(
      {
        studentId: query._id,
      },
      {
        dob,
        bloodGroup,
        admissionNumber,
        gender,
        studentMobileNumber,
        motherName,
        motherMobileNumber,
        fatherName,
        fatherMobileNumber,
        aadharNumber,
        category,
        permanentAddress,
        profilePhoto,
      }
    );
    if (!studentDetails) {
      res.status(404).json({
        message: "Student have not filled details yet.",
        success: false,
      });
    }

    const studentInDB = await Students.findById(query._id);
    studentInDB.isVerified = false;
    await studentInDB.save();

    return res.status(201).json({
      messsage:
        "Your response have been taken into considertaion. Please wait for verification.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchAllStudents = async (req, res) => {
  try {
    const page = req.query.page;

    const students = await Students.find()
      .limit(20)
      .skip(page * 20)
      .select("-password");

    return res.status(200).json({
      message: "Students sent successfully.",
      data: {
        students: students,
      },
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again",
      success: false,
    });
  }
};

export const registerMultipleStudents = async (req, res) => {
  try {
    const added = [];
    const rejected = [];
    const students = req.body.students;
    console.log(students);

    for (let i = 0; i < students.length; i++) {
      const { name, email, department, urn, crn, semester, section } =
        students[i];

      if (
        name === "" ||
        email === "" ||
        department === "" ||
        urn === "" ||
        crn === "" ||
        semester === "" ||
        section === ""
      ) {
        rejected.push(students[i]);
        continue;
      }

      const isStudentAlreadyExisting = await Students.findOne({
        $or: [{ name }, { urn }],
      });

      if (isStudentAlreadyExisting) {
        rejected.push(students[i]);
        continue;
      }
      const hashPassword = await bcrypt.hash(email, 10);
      await Students.create({
        name,
        department,
        email,
        crn: section + "-" + crn,
        urn,
        password: hashPassword,
        semester,
        section,
      });
      added.push(students[i]);
    }
    return res.status(201).json({
      message: `Out of ${students.length} students ${added.length} student(s) were successfully added and ${rejected.length} were rejected.`,
      success: true,
      data: {
        added,
        rejected,
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

export const updateProfile = async (req, res) => {
  try {
    const query = req.query;
    const { name, email, newPassword, oldPassword } = req.body;
    const studentInDB = await Students.findById(query._id);

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      studentInDB.password
    );
    if (!isPasswordMatch) {
      return res.status(409).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const emailTaken = await Students.findOne({ email });
    if (emailTaken) {
      return res.status(403).json({
        message: "Provided email already exists.",
        success: false,
      });
    }

    studentInDB.email = email === "" ? studentInDB.email : email;
    studentInDB.name = name === "" ? studentInDB.name : name;
    studentInDB.password = await bcrypt.hash(newPassword, 10);

    await studentInDB.save();

    return res.status(200).json({
      message: "Student profile updated successfully.",
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

export const deleteSingleStudent = async (req, res) => {
  try {
    const query = req.query;

    const studentDeleted = await Teachers.findByIdAndDelete(query._id);
    if (!studentDeleted) {
      return res.status(404).json({
        message: "Student with given id does not exist.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Student deleted successfully.",
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

export const deleteMultipleStudents = async (req, res) => {
  try {
    const deleted = [];
    const notDeleted = [];

    const students = req.body.teachers;

    for (let i = 0; i < students.length; i++) {
      const { id } = teachers[i];
      const deletedTeacher = await Students.findByIdAndDelete(id);
      if (!deletedTeacher) {
        notDeleted.push(students[i]);
        continue;
      }
      deleted.push(teachers[i]);
    }
    return res.status(200).json({
      message: `Out of ${students.length} students ${deleted.length} has been deleted and ${notDeleted.length} can not be deleted`,
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

export const fetchStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.query;

    const studentInDB = await Students.findById(studentId).select("attendance");

    if (!studentInDB) {
      return res.status(404).json({
        message: "Student not found. Please try again.",
        success: false,
      });
    }
    if (studentInDB.attendance.length === 0) {
      return res.status(404).json({
        message: "No attendance record found for student.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Student attendance sent successfully.",
      success: true,
      attendance: studentInDB.attendance,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const getStudentDetailsById = async (req, res) => {
  try {
    const { id } = req.query;

    const studentInDB = await Students.findById(id).select(
      "semester section department name"
    );
    if (!studentInDB) {
      return res.status(404).json({
        message: "Student not found. Invalid Operation.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Operation completed successfully.",
      success: true,
      student: studentInDB,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const getTimeTable = async (req, res) => {
  try {
    const { section, department, semester } = req.query;

    const timeTableMapInDB = await TimeTableMap.findOne({
      semester,
      section,
      department,
    });

    if (!timeTableMapInDB) {
      console.log("broke");
      return res.status(404).json({
        message: "Time table is not published.",
        success: false,
      });
    }

    const timeTable = await TimeTable.findById(timeTableMapInDB.timeTable);

    if (!timeTable) {
      return res.status(404).json({
        message: "Time table is not published.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Operation Successful.",
      success: true,
      timeTable,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { semester, section, department } = req.query;

    const assignments = await Assignments.find({
      semester,
      section,
      department,
    }).select(
      "subjectCode subjectShortName semester section open department submittedBy assignmentName"
    );
    return res.status(200).json({
      message: `${assignments.length} assignments were successfully sent.`,
      success: true,
      assignments,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const uploadAssignment = async (req, res) => {
  try {
    const file = req.file;
    const { assignmentId, studentId } = req.body;

    const student = await Students.findById(studentId).select("name urn");

    const assignment = await Assignments.findById(assignmentId);

    assignment.submittedBy.push({
      studentId,
      studentName: student.name,
      studentUrn: student.urn,
      assignment: {
        fileName: file.filename,
        path: file.destination,
      },
    });

    await assignment.save();

    return res.status(200).json({
      message: "Assignment uploaded successfully.",
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

export const downloadAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.query;

    const assignmentInDB = await Assignments.findById(assignmentId);

    if (!assignmentInDB) {
      return res.status(404).json({
        message: "Assignment not found in database.",
        success: false,
      });
    }

    res
      .status(200)
      .download(
        assignmentInDB.filePath + "/" + assignmentInDB.fileName,
        `${assignmentInDB.subjectShortName}_${assignmentInDB.assignmentName}_assignment.pdf`,
        (err) => {
          if (err) {
            return res.status(404).json({
              message: "File not found.",
              success: false,
            });
          }
        }
      );
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
