/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Papa from "papaparse";

import {
  INTIAL_STUDENT_DATA,
  QuickLinkStyles,
} from "../../../Constants/Admin.constants";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";

import CloseIcon from "@mui/icons-material/Close";
import {
  addMultipleStudentsAPI,
  addSingleStudentAPI,
} from "../../../../api/admin";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import { INPUT_STYLE } from "../../../Constants/Students.constants";

export default function Students() {
  const department = useLocation().pathname.split("/")[2];
  const [openAddStudents, setOpenAddStudents] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiCalled, setApiCalled] = useState(false);

  return (
    <Wrapper>
      <Heading>Students</Heading>

      <div className="grid gap-2 grid-cols-3 font-semibold">
        <button
          onClick={() => setOpenAddStudents(() => true)}
          className={QuickLinkStyles}
        >
          Add New Student(s)
        </button>
        <Link
          to="all-students"
          className={QuickLinkStyles + " flex justify-center"}
        >
          View All Students
        </Link>
      </div>

      {openAddStudents && (
        <AddStudentsBackdrop
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          department={department}
          setOpen={setOpenAddStudents}
          apiCalled={apiCalled}
          setApiCalled={setApiCalled}
        />
      )}

      {/* //! Snackbar utility... */}
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

function AddStudentsBackdrop({
  setErrorMessage,
  department,
  setSuccessMessage,
  setOpen,
  apiCalled,
  setApiCalled,
}) {
  const [option, setOption] = useState(-1);

  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(INTIAL_STUDENT_DATA);

  function handleMultipleStudentsAdd() {
    if (
      !("name" in students[0]) ||
      !("semester" in students[0]) ||
      !("section" in students[0]) ||
      !("email" in students[0]) ||
      !("crn" in students[0]) ||
      !("urn" in students[0])
    ) {
      setErrorMessage(
        "Something is wrong in CSV sheet please check and try again"
      );
      return;
    }
    setApiCalled(() => true);
    addMultipleStudentsAPI(students, department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setOpen(() => false);
        setOption(() => -1);
        setStudents([]);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setApiCalled(() => false);
      });
  }

  function handleAddSingleStudent() {
    console.log(student);

    if (
      student.name === "" ||
      student.email === "" ||
      student.semester === "" ||
      student.section === "" ||
      student.crn === "" ||
      student.urn === ""
    ) {
      setErrorMessage("All fields must be filled to add student.");
      return;
    }

    setApiCalled(true);
    addSingleStudentAPI(student, department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }

        setSuccessMessage(res.message);
        handleCancle();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setApiCalled(() => false));
  }

  function handleCancle() {
    setOpen(() => false);
    setStudents(() => []);
    setStudent(() => INTIAL_STUDENT_DATA);
    setOption(() => -1);
  }

  function handleFileChange(e) {
    if (e.target.files[0].type !== "text/csv") {
      setErrorMessage("File type is not supported");
      return;
    }
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const jsonArray = results.data;
        setStudents(() => jsonArray);
      },
    });
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="overflow-auto bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpen(false);
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>
          {/* option buttons */}

          <Heading>Add Student(s)</Heading>
          <div className="flex flex-col gap-2">
            <div className="grid gap-0 grid-cols-1 lg:grid-cols-2 lg:gap-3 mx-5">
              <button
                onClick={() => setOption(() => 1)}
                className={QuickLinkStyles}
              >
                Single Student
              </button>
              <button
                onClick={() => setOption(() => 2)}
                className={QuickLinkStyles}
              >
                Multiple Students <sub>(CSV Sheet)</sub>
              </button>
            </div>
            {option === 2 && (
              <div className="px-2 mt-3 grid gap-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                <div className="flex w-full justify-center col-span-2 items-center">
                  <input
                    onChange={handleFileChange}
                    type="file"
                    accept=".csv"
                  />
                </div>
              </div>
            )}
            {option === 2 && students.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-3 mx-5">
                <button
                  disabled={apiCalled}
                  onClick={handleMultipleStudentsAdd}
                  className="w-full outline outline-2 outline-green-500 text-gray-900 font-semibold bg-green-500/40 rounded-md py-1 hover:bg-green-500/80 hover:text-white disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-500/80 transition"
                >
                  Add
                </button>
                <button
                  disabled={apiCalled}
                  onClick={handleCancle}
                  className="w-full outline outline-2 outline-red-500 text-gray-900 font-semibold bg-red-500/20 rounded-md py-1 hover:bg-red-500/60 hover:text-white transition disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* //!  single student addition */}
            {option === 1 && (
              <div className="grid mx-3 grid-cols-1 gap-1 lg:gap-x-3 lg:gap-y-1 lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Eg. Jone Doe"
                    required
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        name: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    placeholder="Eg. Jone@mail.com "
                    required
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        email: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="crn"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    CRN
                  </label>
                  <input
                    type="number"
                    id="crn"
                    placeholder="Eg. 12"
                    required
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        crn: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="urn"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    URN
                  </label>
                  <input
                    type="text"
                    id="number"
                    placeholder="Eg. 300102221021"
                    required
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        urn: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="semester"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Semester
                  </label>
                  <select
                    required
                    name="semester"
                    id="semester"
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        semester: e.target.value,
                      }))
                    }
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
                <div>
                  <label
                    htmlFor="section"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Section
                  </label>
                  <select
                    required
                    id="section"
                    onChange={(e) =>
                      setStudent((student) => ({
                        ...student,
                        section: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  >
                    <option selected value="">
                      Select Section
                    </option>
                    <option value="I">A</option>
                    <option value="II">B</option>
                    <option value="III">DS</option>
                    <option value="IV">AI</option>
                  </select>
                </div>

                <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-3 mx-5 mt-2">
                  <button
                    disabled={apiCalled}
                    onClick={handleAddSingleStudent}
                    className="w-full outline outline-2 outline-green-500 text-gray-900 font-semibold bg-green-500/40 rounded-md py-1 hover:bg-green-500/80 hover:text-white disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-500/80 transition"
                  >
                    Add
                  </button>
                  <button
                    disabled={apiCalled}
                    onClick={handleCancle}
                    className="w-full outline outline-2 outline-red-500 text-gray-900 font-semibold bg-red-500/20 rounded-md py-1 hover:bg-red-500/60 hover:text-white transition disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* //! need to add a feature to show the data of csv sheet do it in the later part */}
        </div>
      </div>
    </div>
  );
}
