import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import DeptRoute from "./Component/Admin/DeptRoute";
import AdminLogin from "./Component/Admin/Login";
import Homepage from "./Component/Homepage/Homepage";
import Navbar from "./Component/Navbar/Navbar";
import Complaints from "./Component/Constants/Complaints";
import Notfound from "./Component/Notfound/Notfound";
import ShowData from "./Component/ShowData/ShowData";
import IssueBook from "./Component/Admin/Library/Helper/IssueBook";
import EditRemoveStudent from "./Component/Admin/Academic/Helpers/EditRemoveStudent";
import EditRemoveTeachers from "./Component/Admin/Academic/Helpers/EditRemoveTeachers";
import CourseManagement from "./Component/Admin/AcademicDepartment/Helper/CourseManagement";
import AssignTgToStudent from "./Component/Admin/AcademicDepartment/Helper/AssignTgToStudent";
import AssignTG from "./Component/Admin/AcademicDepartment/Helper/AssignTG";
import TimeTableManagement from "./Component/Admin/AcademicDepartment/Helper/TimeTableManagement";
import StudentHomepage from "./Component/Student/StudentHomepage";
import TeacherHomepage from "./Component/Teacher/TeacherHomepage";
import ValidateStudents from "./Component/Teacher/Helper/ValidateStudents";
import AddTeachersToCourses from "./Component/Admin/AcademicDepartment/Helper/AddTeachersToCourses";
import ViewEditCourses from "./Component/Admin/AcademicDepartment/Helper/ViewEditCourses";
import AddAttandance from "./Component/Teacher/Helper/AddAttandance";
import AddAttandanceClass from "./Component/Teacher/Helper/AddAttandanceClass";

function App() {
  const [token, setToken] = useState("");

  return (
    <>
      <div className="background_only"></div>
      <Navbar token={token} setToken={setToken} />
      <div className="flex justify-center mb-10">
        <Routes>
          <Route
            path="/"
            element={<Homepage token={token} setToken={setToken} />}
          />
          <Route path="/complaint" element={<Complaints token={token} />} />
          <Route
            path="/admin-login"
            element={<AdminLogin token={token} setToken={setToken} />}
          />
          <Route path="/admin/:department/:id">
            <Route
              path=""
              element={<DeptRoute token={token} setToken={setToken} />}
            />
            <Route path="course-management">
              <Route
                path=""
                element={<CourseManagement token={token} setToken={setToken} />}
              />
              <Route path="edit-course" element={<ViewEditCourses />} />
              <Route
                path="add-teachers-to-courses"
                element={<AddTeachersToCourses />}
              />
            </Route>
            <Route
              path="time-table-management"
              element={
                <TimeTableManagement token={token} setToken={setToken} />
              }
            />
            <Route
              path="assign-tg"
              element={<AssignTG token={token} setToken={setToken} />}
            />
            <Route
              path="assign-tg-to-students"
              element={<AssignTgToStudent token={token} setToken={setToken} />}
            />
            <Route
              path="edit-delete-students"
              element={<EditRemoveStudent />}
            />
            <Route
              path="edit-delete-teachers"
              element={<EditRemoveTeachers />}
            />
            <Route path="issue-book" element={<IssueBook />} />
          </Route>
          <Route path="/teacher/:department/:id">
            <Route
              path=""
              element={<TeacherHomepage token={token} setToken={setToken} />}
            />
            <Route
              path="validate-students"
              element={<ValidateStudents token={token} setToken={setToken} />}
            />
            <Route
              path="add-attandance"
              element={<AddAttandance token={token} setToken={setToken} />}
            />
            <Route
              path="add-attandance/:query"
              element={<AddAttandanceClass token={token} setToken={setToken} />}
            />
          </Route>
          <Route path="/student/:department/:id">
            <Route
              path=""
              element={<StudentHomepage token={token} setToken={setToken} />}
            />
          </Route>
          <Route path="/Contact" element={<>hello world</>} />
          <Route path="/show-data/:data" element={<ShowData />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
