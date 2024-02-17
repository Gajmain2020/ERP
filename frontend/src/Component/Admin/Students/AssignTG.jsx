/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { INPUT_STYLE } from "../../../Constants/Students.constants";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import Loading from "../../Common/Loading";
import {
  assignMultipleStudentsTGAPI,
  assignSingleStudentTGAPI,
  fetchAllStudentsAPI,
  fetchTGAPI,
} from "../../../../api/admin";
import CloseIcon from "@mui/icons-material/Close";

import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

export default function AssignTG() {
  const department = useLocation().pathname.split("/")[2];
  const [searchValue, setSearchValue] = useState("");
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiCalled, setApiCalled] = useState(false);
  const [semester, setSemester] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [tgs, setTgs] = useState([]);
  const [openOption, setOpenOption] = useState(-1);
  const [student, setStudent] = useState("");

  //! use effect to get all the teacher guardians
  useEffect(() => {
    setApiCalled(true);
    fetchTGAPI(department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setTgs(res.tgs);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(false));
  }, [department]);

  //! use effect to get all the students of particular semester
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
          return;
        }
        setStudents(res.students);
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
    //! need to implement this feature in future
  }

  function handleSelectStudent(e, student) {
    if (e.target.checked) {
      setSelectedStudents((students) => [...students, student._id]);
      return;
    }
    setSelectedStudents((students) =>
      students.filter((stu) => stu !== student._id)
    );
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

      {semester !== "" && students.length > 0 && (
        <StudentsTable
          selectedStudents={selectedStudents}
          students={students}
          handleSelectStudent={handleSelectStudent}
          setStudent={setStudent}
          setOpenOption={setOpenOption}
        />
      )}

      {(openOption === 0 || openOption === 1) && (
        <MultipleStudentTGBackdrop
          setOpenOption={setOpenOption}
          openOption={openOption}
          tgs={tgs}
          apiCalled={apiCalled}
          setApiCalled={setApiCalled}
          student={student}
          selectedStudents={selectedStudents}
          department={department}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setSelectedStudents={setSelectedStudents}
          setStudents={setStudents}
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

const studentHeader = [
  "Select",
  "CRN",
  "Name",
  "URN",
  "Email",
  "Sec",
  "TG",
  "Operation",
];

function StudentsTable({
  students,
  handleSelectStudent,
  selectedStudents,
  setStudent,
  setOpenOption,
}) {
  return (
    <div className="relative rounded-lg overflow-x-auto">
      <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
          {selectedStudents.length > 0 ? (
            <tr className="border-b">
              <th colSpan={7} scope="col" className="px-6  whitespace-nowrap ">
                {selectedStudents.length} students have been selected.
              </th>
              <th scope="col" className="px-4 py-4 whitespace-nowrap ">
                <button
                  className="px-4 py-1 border-2 border-sky-300 rounded-md bg-sky-600/60 hover:bg-sky-600/90 transition"
                  onClick={() => setOpenOption(0)}
                >
                  Add TG
                </button>
              </th>
            </tr>
          ) : (
            <tr className="border-b">
              <th colSpan={8} className="px-4 py-5">
                No Students Selected
              </th>
            </tr>
          )}
          <tr className="border-b">
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
              <td className="px-6 font-medium py-2 text-white">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedStudents.includes(student._id)}
                  onClick={(e) => handleSelectStudent(e, student)}
                />
              </td>

              <td className="px-6 font-medium py-2 text-white">
                {student.crn}
              </td>
              <td className="px-6 py-2">{student.name}</td>
              <td className="px-6 py-2">{student.urn}</td>
              <td className="px-6 py-2">{student.email}</td>
              <td className="px-6 py-2">{student.section}</td>
              <td className="px-6 py-2">
                {student.TG ? student.TG.teacherName : "-"}
              </td>
              <td className="px-6 py-2">
                {student.TG ? (
                  <button
                    className="px-2 py-1 border-2 border-slate-300 rounded-md bg-slate-600/60 hover:bg-sky-600/90 transition"
                    onClick={() => {
                      setOpenOption(1);
                      setStudent(student._id);
                    }}
                  >
                    Change
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOpenOption(1);
                      setStudent(student._id);
                    }}
                    className="px-3 py-1 border-2 border-slate-300 rounded-md bg-slate-600/60 hover:bg-sky-600/90 transition"
                  >
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MultipleStudentTGBackdrop({
  setOpenOption,
  openOption,
  tgs,
  apiCalled,
  setApiCalled,
  selectedStudents,
  setSelectedStudents,
  setStudents,
  student,
  department,
  setSuccessMessage,
  setErrorMessage,
}) {
  const [teacher, setTeacher] = useState("");

  function handleAssignTG() {
    setApiCalled(true);
    if (openOption === 0) {
      assignMultipleStudentsTGAPI(department, teacher, selectedStudents)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setSuccessMessage(res.message);
          setOpenOption(-1);
          setSelectedStudents([]);
        })
        .catch((err) => setErrorMessage(err.message))
        .finally(() => setApiCalled(false));
    } else {
      assignSingleStudentTGAPI(department, teacher, student)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setStudents((students) =>
            students.map((stu) => {
              if (stu._id === student) {
                return { ...stu, TG: { teacherName: res.teacherName } };
              }
              return stu;
            })
          );

          setOpenOption(-1);
          setSuccessMessage(res.message);
          return;
        })
        .catch((err) => setErrorMessage(err.message))
        .finally(() => setApiCalled(false));
    }
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpenOption(() => -1);
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>

          <Heading>Select Teacher Guardian</Heading>

          {/* MAIN FORM FOR INPUT */}
          <div className="px-2 mt-3 grid gap-3  lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <label
                htmlFor="semester"
                className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Teacher Guardian
              </label>
              <select
                required
                name="semester"
                id="semester"
                className={INPUT_STYLE}
                onChange={(e) => setTeacher(e.target.value)}
              >
                <option value="">Select TG</option>
                {tgs.map((tg) => (
                  <option key={tg._id} value={tg._id}>
                    {tg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center lg:my-10 md:my-10 sm:my-5  xs:my-5">
            <button
              disabled={apiCalled}
              onClick={handleAssignTG}
              className="border bg-gray-700/70 hover:text-gray-100 hover:bg-gray-800/80 duration-200 transition px-8 py-1 font-semibold rounded-md disabled:hover:cursor-not-allowed disabled:bg-gray-700/50 disabled:text-gray-400 shadow-lg"
            >
              {apiCalled ? "Adding..." : "Assign TG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
