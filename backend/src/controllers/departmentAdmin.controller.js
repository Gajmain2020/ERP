import bcrypt from "bcrypt";

import Courses from "../models/course.model.js";
import Teachers from "../models/teacher.model.js";
import TimeTableMaps from "../models/timeTableMap.model.js";
import Students from "../models/student.model.js";
import TimeTables from "../models/timeTable.model.js";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function logOutError(error) {
  console.log("ERROR:::");
  console.log(error);
  console.log("______________________________________________");
  console.log(error.message);
}

export const testApi = async (req, res) => {
  try {
    console.log("hello world");
    return res.status(200).json({
      message: "Working properly have a nice dat",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseCode,
      courseShortName,
      department,
      semester,
      courseType,
    } = req.body;

    //check if the course is already existing....
    const courseInDB = await Courses.findOne({
      courseCode,
    });

    if (courseInDB) {
      return res.status(409).json({
        message: "Course Code already exists.",
        success: false,
      });
    }

    await Courses.create({
      courseName,
      courseCode,
      courseShortName,
      department,
      semester,
      courseType,
    });
    return res.status(201).json({
      message: "Course added successfully.",
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

export const addTeacherToCourse = async (req, res) => {
  try {
    const { courseCode, teacherId } = req.query;

    const teacherInDB = await Teachers.findById(teacherId);
    const courseInDB = await Courses.findOne({ courseCode });

    //checking if teacher is already in that course or not
    const isTeacherInCourse = courseInDB.takenBy.find(
      (teacher) => teacher.teacherId === teacherId
    );
    //checking if course is already taken by teacher
    const isCourseInTeacher = teacherInDB.coursesTaken.find(
      (course) => course.courseCode === courseCode
    );

    if (!isTeacherInCourse && !isCourseInTeacher) {
      //both do not have course and need to add
      teacherInDB.coursesTaken.push({
        courseName: courseInDB.courseName,
        courseShortName: courseInDB.courseShortName,
        courseCode: courseInDB.courseCode,
        semester: courseInDB.semester,
      });
      await teacherInDB.save();

      courseInDB.takenBy.push({
        teacherName: teacherInDB.name,
        teacherId: teacherInDB._id,
      });
      await courseInDB.save();

      return res.status(201).json({
        message: "Course alloted successfully.",
        success: true,
      });
    } else if (isTeacherInCourse && !isCourseInTeacher) {
      // teacher do not have the course but course have the teacher
      teacherInDB.coursesTaken.push({
        courseName: courseInDB.courseName,
        courseShortName: courseInDB.courseShortName,
        courseCode: courseInDB.courseCode,
        semester: courseInDB.semester,
      });
      await teacherInDB.save();
      return res.status(201).json({
        message: "Course alloted successfully.",
        success: true,
      });
    } else if (!isTeacherInCourse && isCourseInTeacher) {
      //course do not have the teacher
      courseInDB.takenBy.push({
        teacherName: teacherInDB.name,
        teacherId: teacherInDB._id,
      });
      await courseInDB.save();
      return res.status(409).json({
        message: "Course alloted successfully.",
        success: true,
      });
    }
    return res
      .status(409)
      .json({ message: "Course is already alloted.", success: false });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong.Please try again.",
      success: false,
    });
  }
};

export const removeTeacherFromCourse = async (req, res) => {
  try {
    const { teacherId, courseCode } = req.query;

    const courseInDB = await Courses.findOne({ courseCode });
    const teacherInDB = await Teachers.findById(teacherId);

    courseInDB.takenBy = courseInDB.takenBy.filter(
      (teacher) => teacher.teacherId !== teacherId
    );
    await courseInDB.save();

    teacherInDB.coursesTaken = teacherInDB.coursesTaken.filter(
      (course) => course.courseCode !== courseCode
    );
    await teacherInDB.save();

    return res.status(200).json({
      message: "Teacher from course deallocated successfully.",
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong.Please try again.",
      success: false,
    });
  }
};

export const fetchCourses = async (req, res, next) => {
  try {
    const { department } = req.query;
    const courses = await Courses.find({ department })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      message: "Courses sent successfully.",
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchAllCourses = async (req, res) => {
  try {
    const { department } = req.query;
    const courses = await Courses.find({ department }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Courses sent successfully",
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchAllCoursesBySemester = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const courses = await Courses.find({ department, semester }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      message: "Courses sent successfully",
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    const course = await Courses.findOneAndDelete({ _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Course with gven id is not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Courses deleted successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const searchTimeTable = async (req, res) => {
  try {
    const { section, semester, department } = req.query;

    const timeTableMap = await TimeTableMaps.findOne({
      department,
      section,
      semester,
    });

    if (!timeTableMap) {
      return res.status(404).json({
        message: "No time table found for given section and semester.",
        success: false,
      });
    }

    const timeTable = await TimeTables.findById(timeTableMap.timeTable);

    return res.status(200).json({
      message: "Time table for given semester and section already exists.",
      success: true,
      timeTable,
      timeTableMap,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { courseCode, department } = req.query;

    const course = await Courses.findOne({
      courseCode,
    });
    if (!course) {
      return res.status(404).json({
        message: "Course with specified course code not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Course sent successfully.",
      course,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const searchTeacher = async (req, res) => {
  try {
    const { teacherName } = req.query;

    const teachers = await Teachers.find({
      name: { $regex: teacherName, $options: "i" },
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({
        message: "No teachers found.",
        teachers,
        success: false,
      });
    }

    return res.status(200).json({
      teachers,
      message: "Teachers sent successfully.",
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

export const saveTiemeTable = async (req, res) => {
  try {
    const timeTable = req.body;
    const { semester, section, department } = req.query;

    const isTimeTableAlreadyCreated = await TimeTableMaps.findOne({
      semester,
      section,
      department,
    });
    if (isTimeTableAlreadyCreated) {
      return res.status(409).json({
        message: "Time table already exists.",
        success: false,
      });
    }

    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < timeTable[i].length; j++) {
        if (
          timeTable[i][j].courseId === "" ||
          timeTable[i][j].courseShortName === "" ||
          timeTable[i][j].teacherName === "" ||
          timeTable[i][j].teacherId === ""
        ) {
          return res.status(409).json({
            message: "Insfficiency of data.",
            success: false,
          });
        }

        const teacher = await Teachers.findById(timeTable[i][j].teacherId);

        teacher.classesTaken.push({
          courseShortName: timeTable[i][j].courseShortName,
          courseId: timeTable[i][j].courseId,
          semester,
          section,
          period: j,
          dayOfWeek: i,
        });
        await teacher.save();
      }
    }

    const timeTableCreated = await TimeTables.create({ timeTable });

    await TimeTableMaps.create({
      semester,
      section,
      department,
      timeTable: timeTableCreated._id,
    });

    return res
      .status(201)
      .json({ message: "Time table created successfully.", success: true });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addMultipleStudents = async (req, res) => {
  try {
    const { department } = req.query;
    const students = await req.body;

    const added = [];
    const rejected = [];

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
        $or: [{ email }, { urn }],
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

export const addSingleStudent = async (req, res) => {
  try {
    const { department } = req.query;
    const { name, semester, section, crn, urn, email } = req.body;

    const isStudentAlreadyExisting = await Students.findOne({
      $or: [{ urn }, { email }],
    });

    if (isStudentAlreadyExisting) {
      return res.status(409).json({
        message: "Student with given credentials already exists.",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(email, 8);

    await Students.create({
      semester,
      section,
      urn,
      name,
      email,
      password: hashPassword,
      crn: section + "-" + crn,
      department,
    });

    return res.status(201).json({
      message: "Student added successfully.",
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

export const addSingleTeacher = async(req,res)=>{
  try {
    //! work here api endpoint to add single teacher in the database
  } catch (error) {
      return res.status(500).json({
        message:'Something went wrong. Please try again.',
        success:false,
      })    
  }
}

export const addMultipleTeachers = async(req,res)=>{
  try {
    //! work here api endpoint to add multiple teacher in the database
  } catch (error) {
      return res.status(500).json({
        message:'Something went wrong. Please try again.',
        success:false,
      })    
  }
}