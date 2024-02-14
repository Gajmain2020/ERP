/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Papa from "papaparse";

import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";

import { QuickLinkStyles } from "../../../Constants/Admin.constants";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";

import CloseIcon from "@mui/icons-material/Close";
import {
  addMultipleTeachersAPI,
  addSingleTeacherAPI,
  assignTGAPI,
  removeTGAPI,
  searchTeacherAPI,
} from "../../../../api/admin";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import { INPUT_STYLE } from "../../../Constants/Students.constants";

export default function Teachers() {
  const department = useLocation().pathname.split("/")[2];
  const [openAddTeachers, setOpenAddTeachers] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiCalled, setApiCalled] = useState(false);
  const [openAssignTG, setOpenAssignTG] = useState(false);

  return (
    <Wrapper>
      <Heading>Teachers</Heading>

      <div className="grid gap-2 grid-cols-3 font-semibold">
        <button
          onClick={() => setOpenAddTeachers(() => true)}
          className={QuickLinkStyles}
        >
          Add New Teacher(s)
        </button>
        <Link
          to="all-teachers"
          className={QuickLinkStyles + " flex justify-center"}
        >
          View All Teachers
        </Link>
        <button
          onClick={() => setOpenAssignTG(() => true)}
          className={QuickLinkStyles}
        >
          Appoint TG
        </button>
      </div>

      {openAddTeachers && (
        <AddTeachersBackdrop
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          department={department}
          setOpen={setOpenAddTeachers}
          apiCalled={apiCalled}
          setApiCalled={setApiCalled}
        />
      )}
      {openAssignTG && (
        <AssignTGBackdrop
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          department={department}
          setOpen={setOpenAssignTG}
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

function AddTeachersBackdrop({
  setErrorMessage,
  department,
  setSuccessMessage,
  setOpen,
  apiCalled,
  setApiCalled,
}) {
  const [option, setOption] = useState(-1);

  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    empId: "",
    phoneNumber: "",
  });

  function handleAddMultipleTeacher() {
    setApiCalled(() => true);
    addMultipleTeachersAPI(teachers, department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setOpen(() => false);
        setOption(() => -1);
        setTeachers([]);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setApiCalled(() => false);
      });
  }

  function handleAddSingleTeacher() {
    if (
      teacher.name === "" ||
      teacher.email === "" ||
      teacher.empId === "" ||
      teacher.phoneNumber === ""
    ) {
      setErrorMessage("All fields must be filled to add teacher.");
      return;
    }

    setApiCalled(true);
    addSingleTeacherAPI(teacher, department)
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
    setTeachers(() => []);
    setTeacher(() => ({ name: "", empId: "", email: "" }));
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
        setTeachers(() => jsonArray);
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

          <Heading>Add Teachers(s)</Heading>
          <div className="flex flex-col gap-2">
            <div className="grid gap-0 grid-cols-1 lg:grid-cols-2 lg:gap-3 mx-5">
              <button
                onClick={() => setOption(() => 1)}
                className={QuickLinkStyles}
              >
                Single Teacher
              </button>
              <button
                onClick={() => setOption(() => 2)}
                className={QuickLinkStyles}
              >
                Multiple Teachers <sub>(CSV Sheet)</sub>
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
            {option === 2 && teachers.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-3 mx-5">
                <button
                  disabled={apiCalled}
                  onClick={handleAddMultipleTeacher}
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

            {/* //!  single teacher addition */}
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
                      setTeacher((teacher) => ({
                        ...teacher,
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
                      setTeacher((teacher) => ({
                        ...teacher,
                        email: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="empId"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Emp ID
                  </label>
                  <input
                    type="text"
                    id="empId"
                    placeholder="Eg. 12"
                    required
                    onChange={(e) =>
                      setTeacher((teacher) => ({
                        ...teacher,
                        empId: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="phoneNumber"
                    placeholder="Eg. 7975XXX08"
                    required
                    onChange={(e) =>
                      setTeacher((teacher) => ({
                        ...teacher,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className={INPUT_STYLE}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-3 mx-5 mt-2">
                  <button
                    disabled={apiCalled}
                    onClick={handleAddSingleTeacher}
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

function AssignTGBackdrop({
  setErrorMessage,
  department,
  setSuccessMessage,
  setOpen,
  apiCalled,
  setApiCalled,
}) {
  const [searchValue, setSearchValue] = useState({
    empId: "",
    name: "",
  });
  const [teachers, setTeachers] = useState(null);

  function handleCancle() {
    setOpen(() => false);
    setSearchValue(() => ({ empId: "", name: "" }));
  }

  function handleSearch() {
    if (searchValue.name === "" && searchValue.empId === "") {
      setErrorMessage("Atleast one search field is required.");
      return;
    }

    setApiCalled(() => true);
    searchTeacherAPI(searchValue.name, department, searchValue.empId)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setTeachers(res.teachers);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setApiCalled(() => false));
  }

  function handleAssignTG(teacher) {
    setApiCalled(() => true);
    assignTGAPI(teacher, department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }

        setSuccessMessage(res.message);

        setTeachers((teachers) =>
          teachers.map((tea) => {
            if (tea._id === teacher._id) {
              return { ...teacher, isTG: true };
            }
            return tea;
          })
        );
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(() => false));
  }
  function handleRemoveTG(teacher) {
    setApiCalled(() => true);

    removeTGAPI(teacher, department)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);

        setTeachers((teachers) =>
          teachers.map((tea) => {
            if (tea._id === teacher._id) {
              return { ...teacher, isTG: false };
            }
            return tea;
          })
        );
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setApiCalled(() => false));
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="overflow-auto bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpen(() => false);
                handleCancle();
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>
          {/* option buttons */}

          <Heading>Add Teachers(s)</Heading>
          <div className="flex flex-col gap-2">
            <div className="grid gap-0 grid-cols-1 lg:grid-cols-5 lg:gap-3 mx-5">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  onChange={(e) =>
                    setSearchValue((s) => ({ ...s, name: e.target.value }))
                  }
                  className={INPUT_STYLE}
                  placeholder="Ex. Jone Doe"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="empId"
                  className="block ml-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Emp ID
                </label>
                <input
                  type="text"
                  id="empId"
                  onChange={(e) =>
                    setSearchValue((s) => ({ ...s, empId: e.target.value }))
                  }
                  className={INPUT_STYLE}
                  placeholder="Ex. M101"
                />
              </div>
              <div className="row-span-2 flex items-center">
                <button
                  disabled={apiCalled}
                  onClick={handleSearch}
                  className="w-full outline outline-2 outline-blue-500 text-gray-900 font-semibold bg-blue-500/40 rounded-md py-1 hover:bg-blue-500/80 hover:text-white disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-500/80 transition"
                >
                  Search
                </button>
              </div>
            </div>
            {teachers && teachers.length === 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-lg">Opps!!! </span>
                <span>There is no teacher matching to searched name.</span>
              </div>
            )}
            <div className="col-span-2 mx-2">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
                {teachers &&
                  teachers.map((teacher) => (
                    <div key={teacher._id}>
                      <TeacherCard
                        handleAssignTG={handleAssignTG}
                        teacher={teacher}
                        handleRemoveTG={handleRemoveTG}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherCard({ teacher, handleAssignTG, handleRemoveTG }) {
  return (
    <div
      onClick={() => {
        if (!teacher.isTG) handleAssignTG(teacher);
        else handleRemoveTG(teacher);
      }}
      className={
        teacher.isTG
          ? "border rounded-md px-2 py-2 border-dashed border-sky-200 bg-green-400/40 transition duration-200 cursor-pointer hover:bg-red-300/30"
          : "border rounded-md px-2 py-2 border-dashed border-sky-200 hover:bg-green-400/50 transition duration-200 cursor-pointer hover:font-semibold"
      }
    >
      <div className="flex justify-between items-center">
        <span>
          <span className="font-semibold">{teacher.name}</span>
          <span className="flex text-sm gap-3">
            <span>{teacher.empId}</span>
            <span>{teacher.department}</span>
            <span className="font-semibold">
              {teacher.isTG ? "TG" : "Not TG"}
            </span>
          </span>
        </span>
        <span className="hover:text-lime-900/70 transition duration-150 hover:scale-125">
          {!teacher.isTG ? (
            <ControlPointTwoToneIcon />
          ) : (
            <RemoveCircleTwoToneIcon />
          )}
        </span>
      </div>
    </div>
  );
}
