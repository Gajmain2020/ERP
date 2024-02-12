import AdminHomepage from "../Component/Admin/AdminHomepage";
import AdminTimeTable from "../Component/Admin/TimeTable/AdminTimeTable";
import Students from "../Component/Admin/Students/Students";
import Teachers from "../Component/Admin/Teachers/Teachers";
import Course from "../Component/Admin/Course/Course";
import AdminNotice from "../Component/Admin/Notice/AdminNotice";
import AdminComplaints from "../Component/Admin/Complaints/AdminComplaints";

const QuickLinkStyles =
  "bg-slate-700/30 my-2 border border-slate-900 rounded-md py-1.5 hover:bg-slate-700/60 transition hover:text-white text-gray-300 ease-in-out duration-200 hover:shadow-xl shadow-cyan-600";

const INTIAL_COURSE_DATA = {
  courseName: "",
  courseCode: "",
  courseShortName: "",
  semester: "",
  courseType: "core",
};
const INTIAL_STUDENT_DATA = {
  name: "",
  section: "",
  semester: "",
  urn: "",
  crn: "",
  email: "",
};

const CoursesTableHeader = [
  "S. No.",
  "Course Code",
  "Course Name",
  "Short Name",
  "Semester",
  "Course Type",
];

export {
  CoursesTableHeader,
  INTIAL_COURSE_DATA,
  INTIAL_STUDENT_DATA,
  AdminHomepage,
  AdminTimeTable,
  Students,
  Course,
  Teachers,
  AdminNotice,
  AdminComplaints,
  QuickLinkStyles,
};
