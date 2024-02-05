import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import {
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
} from "./Constants/Teacher.constants";

import {
  StudentHomepage,
  TimeTable,
  AssesmentResults,
  Results,
  StudentAssignment,
  PYQ,
  StudentNotice,
  Events,
  Attendance,
  StudentComplaints,
} from "./Constants/Students.constants";
import {
  AdminComplaints,
  AdminHomepage,
  AdminNotice,
  AdminTimeTable,
  Course,
  Students,
  Teachers,
} from "./Constants/Admin.constants";
import AllCourses from "./Component/Admin/Course/AllCourses";

const notLoggedInStyles =
  "flex justify-center mx-auto h-full min-h-screen  items-center";

const loggedInStyles =
  "flex justify-end items-start h-full min-h-screen w-full";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    document.title = "BIT-Buddy";
  }, []);

  return (
    <div className="relative">
      <div className="background_only"></div>
      <Navbar token={token} setToken={setToken} />
      <div className={token === "" ? notLoggedInStyles : loggedInStyles}>
        {token !== "" && <Sidebar token={token} setToken={setToken} />}
        <Routes>
          {BasicRoutes(token, setToken)}
          {TeacherRoutes(token, setToken)}
          {StudentRoutes(token, setToken)}
          {AdminRoutes(token, setToken)}
          {token === "" && <Route path="*" element={<Notfound />} />}
          {token !== "" && <Route path="*" element={<NotFoundLoggedIn />} />}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function BasicRoutes(token, setToken) {
  return (
    <>
      <Route
        path="/"
        element={<Homepage token={token} setToken={setToken} />}
      />
      <Route
        path="/admin-login"
        element={<AdminLogin token={token} setToken={setToken} />}
      />
    </>
  );
}

function TeacherRoutes(token, setToken) {
  return (
    <>
      <Route path="teacher/:department/:id">
        <Route
          path=""
          element={<TeacherHomepage token={token} setToken={setToken} />}
        />
        <Route
          path="classes"
          element={<Classes token={token} setToken={setToken} />}
        />
        <Route
          path="attendence"
          element={<Attendence token={token} setToken={setToken} />}
        />
        <Route
          path="assignment"
          element={<Attendence token={token} setToken={setToken} />}
        />
        <Route
          path="assignments"
          element={<Assignment token={token} setToken={setToken} />}
        />
        <Route
          path="test-paper"
          element={<Testpaper token={token} setToken={setToken} />}
        />
        <Route
          path="notice"
          element={<Notice token={token} setToken={setToken} />}
        />
        <Route
          path="announcement"
          element={<Announcement token={token} setToken={setToken} />}
        />
        <Route
          path="student-validation"
          element={<StudentValidation token={token} setToken={setToken} />}
        />
        <Route
          path="find-student"
          element={<FindStudent token={token} setToken={setToken} />}
        />
        <Route
          path="complaints"
          element={<Complaints token={token} setToken={setToken} />}
        />
      </Route>
    </>
  );
}

function StudentRoutes(token, setToken) {
  return (
    <>
      <Route path="student/:department/:id">
        <Route
          path=""
          element={<StudentHomepage token={token} setToken={setToken} />}
        />
        <Route
          path="attendance"
          element={<Attendance token={token} setToken={setToken} />}
        />
        <Route
          path="time-table"
          element={<TimeTable token={token} setToken={setToken} />}
        />
        <Route
          path="assesment-results"
          element={<AssesmentResults token={token} setToken={setToken} />}
        />
        <Route
          path="results"
          element={<Results token={token} setToken={setToken} />}
        />
        <Route
          path="assignments"
          element={<StudentAssignment token={token} setToken={setToken} />}
        />
        <Route path="pyq" element={<PYQ token={token} setToken={setToken} />} />
        <Route
          path="notice"
          element={<StudentNotice token={token} setToken={setToken} />}
        />
        <Route
          path="events"
          element={<Events token={token} setToken={setToken} />}
        />
        <Route
          path="complaints"
          element={<StudentComplaints token={token} setToken={setToken} />}
        />
      </Route>
    </>
  );
}

function AdminRoutes(token, setToken) {
  return (
    <>
      <Route path="admin/:department/:id">
        <Route
          path=""
          element={<AdminHomepage token={token} setToken={setToken} />}
        />
        <Route path="courses">
          <Route
            path=""
            element={<Course token={token} setToken={setToken} />}
          />
          <Route
            path="all-courses"
            element={<AllCourses token={token} setToken={setToken} />}
          />
        </Route>
        <Route
          path="time-table"
          element={<AdminTimeTable token={token} setToken={setToken} />}
        />
        <Route
          path="students"
          element={<Students token={token} setToken={setToken} />}
        />
        <Route
          path="teachers"
          element={<Teachers token={token} setToken={setToken} />}
        />
        <Route
          path="notice"
          element={<AdminNotice token={token} setToken={setToken} />}
        />
        <Route
          path="complaints"
          element={<AdminComplaints token={token} setToken={setToken} />}
        />
      </Route>
    </>
  );
}

export default App;
