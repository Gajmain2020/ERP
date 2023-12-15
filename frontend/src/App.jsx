import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Component/Navbar/Navbar";
import Homepage from "./Component/Homepage";
import Notfound from "./Component/Common/NotFound";
import Footer from "./Component/Common/Footer";
import AdminLogin from "./Component/Admin/AdminLogin";
import TeacherHomepage from "./Component/Teacher/TeacherHomepage";
import Sidebar from "./Component/Common/Sidebar";
import Classes from "./Component/Teacher/Classes/Classes";
import Attendence from "./Component/Teacher/Attendence/Attendence";
import Assignment from "./Component/Teacher/Assignment/Assignment";
import Testpaper from "./Component/Teacher/TestPaper/Testpaper";
import Notice from "./Component/Teacher/Notice/Notice";
import Announcement from "./Component/Teacher/Announcement/Announcement";
import StudentValidation from "./Component/Teacher/StudentValidation/StudentValidation";
import Complaints from "./Component/Teacher/Complaints/Complaints";
import NotFoundLoggedIn from "./Component/Common/NotFoundLoggedIn";

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
          path="complaints"
          element={<Complaints token={token} setToken={setToken} />}
        />
      </Route>
    </>
  );
}

export default App;
