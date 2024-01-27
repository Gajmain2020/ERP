/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import {
  QuickLinkStyles,
  INTIAL_COURSE_DATA,
} from "../../../Constants/Admin.constants";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import CloseIcon from "@mui/icons-material/Close";
import { addCourseAPI } from "../../../../api/admin";
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

  function handleAddNewCourse() {
    console.log(courseData);
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
      table component here
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
