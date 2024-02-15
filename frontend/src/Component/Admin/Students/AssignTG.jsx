/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { INPUT_STYLE } from "../../../Constants/Students.constants";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import Loading from "../../Common/Loading";
import { fetchAllStudentsAPI } from "../../../../api/admin";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

export default function AssignTG() {
  const department = useLocation().pathname.split("/")[2];
  const studentsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showStudents, setShowStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiCalled, setApiCalled] = useState(false);
  const [semester, setSemester] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    setApiCalled(true);
    if (semester === "") {
      return;
    }
    fetchAllStudentsAPI(department, semester)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          setStudents(() => []);
          setShowStudents(() => []);
          setCurrentPage(() => 0);
          return;
        }
        setStudents(() => res.students);
        setShowStudents(() =>
          res.students.slice(
            currentPage * studentsPerPage,
            Math.min(
              students.length,
              currentPage * studentsPerPage + studentsPerPage
            )
          )
        );
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(() => false);
        setApiCalled(() => false);
      });
  }, [semester, department]);

  function handleSearchClick() {
    console.log(searchValue);
  }

  function handleSelectStudent() {
    console.log(selectedStudents);
  }

  return (
    <Wrapper>
      <Heading>
        Assign TG
        <span className="text-sm flex justify-center items-end">
          (Teacher Guardian)
        </span>
      </Heading>
      <div className="flex justify-center items-center gap-2">
        <select
          required
          name="semester"
          id="semester"
          onChange={(e) => setSemester(() => e.target.value)}
          className="border  text-sm rounded-lg block w-32 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ring-blue-500 focus:border-blue-500 font-semibold"
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
        <input
          type="text"
          className={INPUT_STYLE}
          placeholder="Search Student"
          onChange={(e) => setSearchValue(() => e.target.value)}
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-2 outline outline-2 outline-blue-500 text-gray-50 font-semibold bg-blue-500/40 rounded-md  hover:bg-blue-500/80 hover:text-white disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-500/80 transition"
        >
          Search
        </button>
      </div>
      {semester === "" && (
        <div className="flex justify-center items-center mt-3 text-lg">
          Please Select Semester
        </div>
      )}
      {semester !== "" && loading && <Loading />}
      {semester !== "" && students.length === 0 && (
        <div className="flex justify-center items-center mt-3 text-lg">
          No Students To Display
        </div>
      )}

      {semester !== "" && showStudents.length > 0 && (
        <StudentsTable
          students={showStudents}
          handleStudentSelect={handleSelectStudent}
        />
      )}

      {/* //! utility for snackbar */}
      {(errorMessage !== "" || successMessage !== "") && (
        <ErrSuccSnackbar
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </Wrapper>
  );
}

const studentHeader = ["Select", "CRN", "Name", "URN", "Email", "Sec", "TG"];

function StudentsTable({ students, handleSelectStudent }) {
  return (
    <div className="relative rounded-lg overflow-x-auto">
      <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
          <tr>
            {studentHeader.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-4 whitespace-nowrap "
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student._id}
              className="bg-gray-500/80 hover:bg-gray-700/70 transition duration-200 border-b dark:border-gray-700 dark:text-gray-200"
            >
              <td className="px-6 font-medium py-2 text-white">select</td>

              <td className="px-6 font-medium py-2 text-white">
                {student.crn}
              </td>
              <td className="px-6 py-2">{student.name}</td>
              <td className="px-6 py-2">{student.urn}</td>
              <td className="px-6 py-2">{student.email}</td>
              <td className="px-6 py-2">{student.section}</td>
              <td className="px-6 py-2">
                {student.TG ? student?.TG?.name : "get tg"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
