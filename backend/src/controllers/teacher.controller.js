import fs from "fs";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Teachers from "../models/teacher.model.js";
import Notices from "../models/notice.model.js";
import Assignments from "../models/assignment.model.js";
import Students from "../models/student.model.js";
import StudentDetails from "../models/studentDetails.model.js";

const Month_Options = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function logOutError(error) {
  console.log("ERROR:::");
  console.log(error);
  console.log("______________________________________________");
  console.log(error.message);
}

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
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
    const token = jwt.sign(
      {
        name: teacherInDB.name,
        department: teacherInDB.department,
        email: teacherInDB.email,
        empId: teacherInDB.empId,
        phoneNumber: teacherInDB.phoneNumber,
        id: teacherInDB._id,
        isTG: teacherInDB.isTG,
        userType: "teacher",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: "Loged in successfully.",

      id: teacherInDB._id,
      empId: teacherInDB.empId,
      department: teacherInDB.department,
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

export const deleteAssignment = async (req, res) => {
  try {
    //! need to work here buddy
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const searchStudent = async (req, res) => {
  try {
    const { name, urn, crn, department } = req.query;
    let students = [];
    let studentsToSend = [];

    if (
      (urn === undefined || urn === "") &&
      (crn === undefined || crn === "") &&
      (name === undefined || name === "")
    ) {
      return res.status(400).json({
        message: "Atleast one field must be provided.",
        success: false,
      });
    }

    if (name !== undefined && name !== "") {
      const studentsByName = await Students.find({
        name: { $regex: name, $options: "i" },
        department,
      });
      // students.push(...studentsByName);

      students.push(
        ...studentsByName.filter((student) => {
          if (!students.includes(student._id)) {
            return student;
          }
        })
      );
    }
    if (crn !== undefined && crn !== "") {
      const studentsByCrn = await Students.find({
        crn: { $regex: crn, $options: "i" },
        department,
      });
      students.push(
        ...studentsByCrn.filter((student) => {
          if (!students.includes(student._id)) {
            return student;
          }
        })
      );
    }
    if (urn !== undefined && urn !== "") {
      const studentsByUrn = await Students.find({
        urn: { $regex: urn, $options: "i" },
        department,
      });
      students.push(
        ...studentsByUrn.filter((student) => {
          if (!students.includes(student._id)) {
            return student;
          }
        })
      );
    }

    return res.status(200).json({
      message: `${students.length} student(s) found.`,
      success: true,
      students,
      numberOfStudents: students.length,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const getAllStudentsBySemester = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const students = await Students.find({
      semester,
      department,
    }).select("-password");

    return res.status(200).json({
      message: "Students sent successfully.",
      success: true,
      numberOfStudents: students.length,
      students,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const getAllStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    const students = await Students.find({ department }).select("-password");

    return res.status(200).json({
      message: "Students sent successfully.",
      students,
      success: true,
      numberOfStudents: students.length,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchClass = async (req, res) => {
  try {
    const { teacherId, semester, section, period, day } = req.query;

    const teacher = await Teachers.findOne({
      _id: teacherId,
    }).select("classesTaken department");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found.",
      });
    }

    var cls;

    for (let i = 0; i < teacher.classesTaken.length; i++) {
      if (
        teacher.classesTaken[i].semester === semester &&
        teacher.classesTaken[i].section === section &&
        teacher.classesTaken[i].period === parseInt(period) &&
        teacher.classesTaken[i].dayOfWeek === parseInt(day)
      ) {
        cls = teacher.classesTaken[i];
        break;
      }
    }

    if (!cls) {
      return res.status(404).json({
        message: "You do not have class at particular day and time.",
        success: false,
      });
    }

    const students = await Students.find({
      semester: cls.semester,
      section: cls.section,
      department: teacher.department,
    }).select("urn name _id section email crn");

    return res.status(200).json({
      message: "Students of class sent successfully.",
      success: true,
      cls: cls,
      students: students,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const downloadAttendanceCSV = async (req, res) => {
  try {
    const { teacherId, semester, section, courseShortName } = req.query;

    const teacher = await Teachers.findById(teacherId).select(
      "classesTaken department"
    );

    var classExists = false;

    for (let i = 0; i < teacher.classesTaken.length; i++) {
      if (
        teacher.classesTaken[i].semester === semester &&
        teacher.classesTaken[i].section === section &&
        teacher.classesTaken[i].courseShortName === courseShortName
      ) {
        classExists = true;
        break;
      }
    }

    //! if the class doesn't exist
    if (!classExists) {
      return res.status(404).json({
        message:
          "You have no assigned class in provided semester and section with the given course short name.",
        success: false,
      });
    }

    //! fetch the required students for csv data
    const students = await Students.find({
      department: teacher.department,
      semester,
      section,
    }).select("urn crn name");

    res.status(200).json({
      students,
      success: true,
      message: "Sent successfully.",
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addAttendance = async (req, res) => {
  try {
    const { teacherId, date, period, courseShortName } = req.query;

    const students = req.body;

    const teacher = await Teachers.findById(teacherId).select("name empId");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher is invalid.",
        success: false,
      });
    }

    const month = Month_Options[parseInt(date.split("-")[1]) - 1];

    for (let i = 0; i < students.length; i++) {
      const student = await Students.findById(students[i].studentId);
      if (
        !student.attendance ||
        student.attendance === null ||
        student.attendance.length === 0
      ) {
        student.attendance = [
          {
            month,
            totalClass: 1,
            totalPresent: students[i].present ? 1 : 0,
            totalAbsent: !students[i].present ? 1 : 0,
            classes: [
              {
                courseShortName,
                status: [
                  {
                    period,
                    date: new Date(date),
                    present: students[i].present,
                    takenBy: teacher.name,
                  },
                ],
              },
            ],
          },
        ];
        await student.save();
        continue;
      }

      const attForMonth = student.attendance.find((att) => att.month === month);

      if (!attForMonth) {
        student.attendance.push({
          month,
          totalClass: 1,
          totalPresent: students[i].present ? 1 : 0,
          totalAbsent: !students[i].present ? 1 : 0,
          classes: [
            {
              courseShortName,
              status: [
                {
                  period,
                  date: new Date(date),
                  present: students[i].present,
                  takenBy: teacher.name,
                },
              ],
            },
          ],
        });
        await student.save();
        continue;
      }

      const attForCourse = attForMonth.classes.find(
        (att) => att.courseShortName === courseShortName
      );

      if (attForMonth && !attForCourse) {
        attForMonth.classes.push({
          courseShortName,
          status: [
            {
              period,
              date: new Date(date),
              present: students[i].present,
              takenBy: teacher.name,
            },
          ],
        });

        student.attendance.map((att) => {
          if (att.month === month) {
            return {
              ...attForMonth,
              totalClass: attForMonth.totalClass + 1,
              totalPresent:
                attForMonth.totalPresent + students[i].present ? 1 : 0,
              totalAbsent:
                attForMonth.totalAbsent + !students[i].present ? 1 : 0,
            };
          }
          return att;
        });
        await student.save();

        continue;
      }

      if (attForMonth && attForCourse) {
        attForCourse.status.push({
          period,
          date: new Date(date),
          present: students[i].present,
          takenBy: teacher.name,
        });

        attForMonth.classes.map((cls) => {
          if (cls.courseShortName === courseShortName) {
            return { ...cls, status: attForCourse };
          }
        });

        student.attendance.map((att) => {
          if (att.month === month) {
            return {
              ...attForMonth,
              totalClass: attForMonth.totalClass + 1,
              totalPresent:
                attForMonth.totalPresent + students[i].present ? 1 : 0,
              totalAbsent:
                attForMonth.totalAbsent + !students[i].present ? 1 : 0,
            };
          }
          return att;
        });
        await student.save();
      }
    }
    return res.status(200).json({
      message: "Attendance uploaded successfully.",
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

export const fetchStudentDetails = async (req, res) => {
  try {
    const { rollNumber } = req.query;

    const studentBasicDetails = await Students.findOne({
      urn: rollNumber,
    }).select("-password -attendance");
    const studentDetails = await StudentDetails.findOne({
      studentUrn: rollNumber,
    });

    if (!studentDetails) {
      return res.status(404).json({
        message: "Details not yet filled by student.",
        success: false,
      });
    }
    if (!studentBasicDetails) {
      return res.status(404).json({
        message: "Student not found.",
        success: false,
      });
    }

    const image = base64_encode(
      studentDetails.profilePhoto.destination +
        "/" +
        studentDetails.profilePhoto.fileName
    );

    const studentData = {
      studentBasicDetails,
      studentDetails,
      profilePhoto: image,
    };

    return res.status(200).json({
      message: "Student details sent successfully",
      studentData,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
