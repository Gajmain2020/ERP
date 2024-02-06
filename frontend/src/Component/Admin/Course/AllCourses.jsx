import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import { deleteCourseAPI, fetchAllCoursesAPI } from "../../../../api/admin";
import { CoursesTableHeader } from "../../../Constants/Admin.constants";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

export default function AllCourses() {
  const department = useLocation().pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [courses, setCourses] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);

  const courseId = useParams();

  useEffect(() => {
    setApiCalled(() => true);

    if (department || !courses) {
      fetchAllCoursesAPI(department)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setCourses(() => res.courses);
        })
        .catch((err) => setErrorMessage(err.message))
        .finally(() => setApiCalled(() => false));
    }
  }, []);

  function handleDeleteCourse(courseId) {
    setApiCalled(() => true);
    deleteCourseAPI(department, courseId)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(() => res.message);
          return;
        }
        setSuccessMessage(() => res.message);
        setCourses((courses) =>
          courses.filter((course) => course._id !== courseId)
        );
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(() => false));
  }

  return (
    <Wrapper>
      <Heading>All Courses</Heading>

      <div className="relative rounded-lg overflow-x-auto">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
            <tr>
              {CoursesTableHeader.map((header) => (
                <th key={header} scope="col" className="px-3 py-4">
                  {header}
                </th>
              ))}
              <th scope="col" className="px-3 py-4">
                Delete
              </th>
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
                  onClick={() => naviate(course._id)}
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
                  <td className="px-6 py-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course._id);
                      }}
                    >
                      <DeleteForeverTwoToneIcon className="delete-button" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {(errorMessage || successMessage) && (
        <ErrSuccSnackbar
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      <div>{/* PAGINATION COMPONENT TO BE ADDED HERE */}</div>
    </Wrapper>
  );
}
