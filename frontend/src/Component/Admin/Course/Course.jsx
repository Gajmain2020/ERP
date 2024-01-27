/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import {
  QuickLinkStyles,
  INTIAL_COURSE_DATA,
  CoursesTableHeader,
} from "../../../Constants/Admin.constants";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import CloseIcon from "@mui/icons-material/Close";
import { addCourseAPI, fetchCoursesAPI } from "../../../../api/admin";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

export default function Course() {
  const navigate = useNavigate();
  const department = useLocation().pathname.split("/")[2];
  const [openAddNewCourse, setOpenAddNewCourse] = useState(false);
  const [courseData, setCourseData] = useState({
    ...INTIAL_COURSE_DATA,
    department,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiCalled, setApiCalled] = useState(false);
  const [courses, setCoruses] = useState(null);

  useEffect(() => {
    if (department && !courses) {
      console.log("hello world");
      setApiCalled(() => true);
      fetchCoursesAPI(department)
        .then((res) => setCoruses(() => res.courses))
        .catch((err) => setErrorMessage(err))
        .finally(() => setApiCalled(() => false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddNewCourse() {
    if (
      courseData.courseCode === "" ||
      courseData.courseShortName === "" ||
      courseData.courseName === "" ||
      courseData.semester === ""
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
    setApiCalled(() => true);
    addCourseAPI(courseData)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setOpenAddNewCourse(() => false);
        setCourseData(() => ({
          ...INTIAL_COURSE_DATA,
          department: department,
        }));
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(() => false));
  }

  return (
    <Wrapper>
      <Heading>Courses</Heading>
      {/* BUTTON CONTAINER TO SEARCH AND ADD NEW COURSE */}
      <div className="grid gap-2 grid-cols-2">
        <button
          onClick={() => setOpenAddNewCourse(() => true)}
          className={QuickLinkStyles}
        >
          Add New Course
        </button>
        <Link
          to="all-courses"
          className={QuickLinkStyles + " flex justify-center"}
        >
          View All Courses
        </Link>
      </div>
      {/* COMPONENT TO DISPLAY SOME COURSES */}
      <div className="relative rounded-lg overflow-x-auto">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
            <tr>
              {CoursesTableHeader.map((header) => (
                <th key={header} scope="col" className="px-3 py-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses === null && (
              <tr className="bg-gray-500/80 border-b dark:border-gray-700 dark:text-gray-200">
                <td colSpan={6} className="text-lg">
                  Loading...
                </td>
              </tr>
            )}
            {courses && courses.length === 0 && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={6} className="text-lg">
                  No Courses To Be Displayed{" "}
                </td>
              </tr>
            )}

            {courses &&
              courses.length > 0 &&
              courses.map((course, idx) => (
                <tr
                  key={course._id}
                  onClick={() => alert(course._id)}
                  className="bg-gray-500/80 hover:bg-gray-700/70 transition duration-200 border-b dark:border-gray-700 dark:text-gray-200"
                >
                  <th scope="row" className="px-6 py-2 whitespace-nowrap ">
                    {idx + 1}
                  </th>
                  <td className="px-6 font-medium py-2 text-white">
                    {course.courseCode}
                  </td>
                  <td className="px-6 py-2">{course.courseName}</td>
                  <td className="px-6 py-2">{course.courseShortName}</td>
                  <td className="px-6 py-2">{course.semester}</td>
                  <td className="px-6 py-2">
                    {course.courseType === "core"
                      ? "Core"
                      : course.courseType === "elective"
                      ? "Prof. Elective"
                      : "Open Elective"}
                  </td>
                </tr>
              ))}
            {courses && courses.length === 5 && (
              <tr className="bg-gray-500/80 border-b dark:border-gray-700 dark:text-gray-200">
                <td colSpan={6}>
                  <span className="flex justify-center m-1.5 items-center">
                    <Link
                      to="all-courses"
                      className="relative inline-flex items-center justify-center p-4 px-6 py-2 overflow-hidden font-medium text-slate-600 transition duration-300 ease-out border-2 border-slate-900 rounded-full shadow-md group"
                    >
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-slate-300/50 rounded-full group-hover:translate-x-0 ease">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-slate-900 transition-all duration-300 transform group-hover:translate-x-full ease">
                        View All{" "}
                      </span>
                      <span className="relative invisible">View All</span>
                    </Link>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* UTILITIES LIKE BACKDROP AND SNACKBAR */}
      {openAddNewCourse && (
        <BackDropComponent
          courseData={courseData}
          setCourseData={setCourseData}
          setOpen={setOpenAddNewCourse}
          handleAddNewCourse={handleAddNewCourse}
          apiCalled={apiCalled}
        />
      )}
      {(errorMessage !== "" || successMessage !== "") && (
        <ErrSuccSnackbar
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </Wrapper>
  );
}

//
function BackDropComponent({
  setOpen,
  setCourseData,
  handleAddNewCourse,
  apiCalled,
}) {
  function handleChange(e) {
    setCourseData((courseData) => ({
      ...courseData,
      [e.target.name]: e.target.value,
    }));
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setOpen(() => false);
    }
  });

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpen(false);
                setCourseData((course) => ({
                  ...INTIAL_COURSE_DATA,
                  department: course.department,
                }));
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>

          <Heading>Add New Cousrse</Heading>

          {/* MAIN FORM FOR INPUT */}
          <div className="px-2 mt-3 grid gap-3  lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <label
                htmlFor="courseCode"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                placeholder="Eg. 102301CS"
                required
                onChange={handleChange}
                className={INPUT_STYLE}
              />
            </div>
            <div>
              <label
                htmlFor="courseName"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                onChange={handleChange}
                className={INPUT_STYLE}
                placeholder="Eg. Applied Mathematics 3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="courseShortName"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Short Name
              </label>
              <input
                type="text"
                id="courseShortName"
                name="courseShortName"
                onChange={handleChange}
                className={INPUT_STYLE}
                placeholder="Eg. AM3"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full">
                <label
                  htmlFor="semester"
                  className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Semester
                </label>
                <select
                  required
                  name="semester"
                  id="semester"
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Select Semester
                  </option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="VI">VI</option>
                  <option value="VII">VII</option>
                  <option value="VIII">VIII</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="courseType"
                  className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Semester
                </label>
                <select
                  required
                  name="courseType"
                  id="courseType"
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Select Course Type
                  </option>
                  <option value="core">Core</option>
                  <option value="elective">Professional Elective</option>
                  <option value="open">Open Elective</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:my-10 md:my-10 sm:my-5  xs:my-5">
            <button
              disabled={apiCalled}
              onClick={handleAddNewCourse}
              className="border bg-gray-700/70 hover:text-gray-100 hover:bg-gray-800/80 duration-200 transition px-8 py-1 font-semibold rounded-md disabled:hover:cursor-not-allowed disabled:bg-gray-700/50 disabled:text-gray-400 shadow-lg"
            >
              {apiCalled ? "Adding..." : "Add Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
