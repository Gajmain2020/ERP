import Courses from "../models/course.model.js";
import Teachers from "../models/teacher.model.js";

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
