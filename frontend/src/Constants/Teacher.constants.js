import Navbar from "../Component/Navbar/Navbar";
import Homepage from "../Component/Homepage";
import Notfound from "../Component/Common/NotFound";
import Footer from "../Component/Common/Footer";
import AdminLogin from "../Component/Admin/AdminLogin";
import TeacherHomepage from "../Component/Teacher/TeacherHomepage";
import Sidebar from "../Component/Common/Sidebar";
import Classes from "../Component/Teacher/Classes/Classes";
import Attendence from "../Component/Teacher/Attendence/Attendence";
import Assignment from "../Component/Teacher/Assignment/Assignment";
import Testpaper from "../Component/Teacher/TestPaper/Testpaper";
import Notice from "../Component/Teacher/Notice/Notice";
import Announcement from "../Component/Teacher/Announcement/Announcement";
import StudentValidation from "../Component/Teacher/StudentValidation/StudentValidation";
import Complaints from "../Component/Teacher/Complaints/Complaints";
import NotFoundLoggedIn from "../Component/Common/NotFoundLoggedIn";
import FindStudent from "../Component/Teacher/FindStudent/FindStudent";

const AttendanceHeaderOption = [
  "Date",
  "Subject",
  "Period",
  "Faculty",
  "Status",
];

export {
  AttendanceHeaderOption,
  Navbar,
  Homepage,
  Notfound,
  Footer,
  AdminLogin,
  TeacherHomepage,
  Sidebar,
  Classes,
  Attendence,
  Assignment,
  Testpaper,
  Notice,
  Announcement,
  StudentValidation,
  Complaints,
  NotFoundLoggedIn,
  FindStudent,
};
