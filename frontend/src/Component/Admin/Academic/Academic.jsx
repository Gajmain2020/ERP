import {
  Alert,
  Backdrop,
  Button,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  addMultipleStudents,
  addMultipleTeachers,
  addSingleStudent,
  addSingleTeacher,
} from "../../../../api/admin";
import DeleteIcon from "@mui/icons-material/Delete";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

const initialStudent = {
  name: "",
  urn: "",
  email: "",
  department: "",
  semester: "",
  year: "",
};
const initialTeacher = {
  empId: "",
  name: "",
  email: "",
  department: "",
};
const dept = ["", "CIVIL", "CSE", "EE", "EEE", "ETC", "IT", "MECH"];
const year = ["", "1", "2", "3", "4"];
const semester = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Academic({ setToken }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [option, setOption] = useState(0);
  const [studentOption, setStudentOption] = useState(0);
  const [teacherOption, setTeacherOption] = useState(0);
  const [studentData, setStudentData] = useState(initialStudent);
  const [fileName, setFileName] = useState("No file selected.");
  const [studentsData, setStudentsData] = useState([]);
  const [teacherData, setTeacherData] = useState(initialTeacher);
  const [teachersData, setTeachersData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);

  function handleCloseBackdrop() {
    setOption(0);
    setStudentOption(0);
    setTeacherOption(0);
    setStudentData(initialStudent);
    setTeacherData(initialTeacher);
    setTeachersData([]);
    setStudentsData([]);
    return;
  }
  function handleStudentDataChange(e) {
    setStudentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleTeacherDataChange(e) {
    setTeacherData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  function handleSubmitTeacher() {
    if (
      teacherData.name === "" ||
      teacherData.email == "" ||
      teacherData.empId == "" ||
      teacherData.department == ""
    ) {
      setErrorMessage("* All fields are required.");
      return;
    }
    setApiCalled(true);
    addSingleTeacher(teacherData).then((res) => {
      setApiCalled(false);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      handleCloseBackdrop();
      return;
    });
  }
  function handleSubmit() {
    if (
      studentData.name === "" ||
      studentData.email == "" ||
      studentData.urn == "" ||
      studentData.department == "" ||
      studentData.year == "" ||
      studentData.semester == ""
    ) {
      setErrorMessage("* All fields are required.");
      return;
    }
    setApiCalled(true);
    addSingleStudent(studentData).then((res) => {
      setApiCalled(false);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      handleCloseBackdrop();
      return;
    });
  }
  function handleFileUpload(e) {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (res) {
        const columnArray = [];
        const valueArray = [];

        res.data.map((d) => {
          columnArray.push(Object.keys(d));
          valueArray.push(Object.values(d));
        });

        setStudentsData(() => res.data);
      },
    });
  }
  function handleFileUploadTeacher(e) {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (res) {
        const columnArray = [];
        const valueArray = [];

        res.data.map((d) => {
          columnArray.push(Object.keys(d));
          valueArray.push(Object.values(d));
        });

        setTeachersData(() => res.data);
      },
    });
  }
  function handleUnloadFile() {
    setFileName("No file selected.");
    setStudentData([]);
    setTeachersData([]);
  }

  function handleViewData() {
    const data = studentsData.length > 0 ? studentsData : teachersData;
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `http://127.0.0.1:5173/show-data/${encodedData}`;
    window.open(url, "_blank", "width=800 height=600");
  }

  function handleMultpleTeacherAdd() {
    setApiCalled(true);
    for (let i = 0; i < teachersData.length; i++) {
      if (
        teachersData[i].empId === "" ||
        teachersData[i].name === "" ||
        teachersData[i].email === "" ||
        teachersData[i].department === ""
      ) {
        setErrorMessage(
          "Some fields are empty in CSV file. Please update CSV and Upload."
        );
        return;
      }
    }
    addMultipleTeachers(teachersData)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        handleCloseBackdrop();
        handleUnloadFile();
      })
      .catch((err) => setErrorMessage(err.message));
  }
  function handleMultipleStudentAdd() {
    setApiCalled(true);
    for (let i = 0; i < studentsData.length; i++) {
      if (
        studentsData[i].urn === "" ||
        studentsData[i].name === "" ||
        studentsData[i].email === "" ||
        studentsData[i].department === "" ||
        studentsData[i].year === "" ||
        studentsData[i].semester === ""
      ) {
        setErrorMessage(
          "Some fields are empty in CSV file. Please update CSV and Upload."
        );
        return;
      }
    }
    addMultipleStudents(studentsData)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        handleCloseBackdrop();
        handleUnloadFile();
      })
      .catch((err) => setErrorMessage(err.message));
  }

  return (
    <>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <div className="w-4/5 flex justify-middle align-middle border-rounded p-2 lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 ">
        <div className="mx-auto w-full text-white">
          <h1 className="text-4xl flex gap-2 justify-center flex-col text-center font-main heading mx-auto">
            Welcome Admin
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="w-full mt-4">
          <div className=" mx-auto bg-gray-100/50 p-6 rounded-md shadow-md">
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    onClick={() => setOption(1)}
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Add Students
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    onClick={() => setOption(2)}
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Add Teachers
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                    onClick={() => navigate("edit-delete-students")}
                  >
                    Edit / Remove Students
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                    onClick={() => navigate("edit-delete-teachers")}
                  >
                    Edit / Remove Teachers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white">
          {option !== 0 && option === 1 && (
            <Modal open={option === 1} onClose={() => setOption(0)}>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-1/2 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-200/50 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                  <div className="absolute top-1 right-1">
                    <Button
                      onClick={handleCloseBackdrop}
                      color="error"
                      size="small"
                      variant="contained"
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                  <Button
                    className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setStudentOption(1);
                    }}
                  >
                    Add Individual Student
                  </Button>
                  <Button
                    className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setStudentOption(2);
                    }}
                  >
                    Add Students Via CSV Sheet
                  </Button>
                </div>
              </Backdrop>
            </Modal>
          )}
          {option !== 0 && option === 2 && (
            <>
              {" "}
              <Modal open={option === 2} onClose={() => setOption(0)}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-1/2 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-200/50 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={handleCloseBackdrop}
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        <CloseIcon />
                      </Button>
                    </div>
                    <Button
                      className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setTeacherOption(1);
                      }}
                    >
                      Add Individual Teacher
                    </Button>
                    <Button
                      className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setTeacherOption(2);
                      }}
                    >
                      Add Teachers Via CSV Sheet
                    </Button>
                  </div>
                </Backdrop>
              </Modal>
            </>
          )}
          {studentOption !== 0 && studentOption === 1 && (
            <>
              <Modal open={option === 1} onClose={() => setOption(0)}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-5/6 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-300/70 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={handleCloseBackdrop}
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        <CloseIcon />
                      </Button>
                    </div>

                    <div className="flex w-full">
                      <div className="flex gap-5 w-full xs:flex-wrap sm:flex-wrap xs:gap-2 sm:gap:2">
                        <TextField
                          label="Name"
                          placeholder="Ex. Jone Doe"
                          fullWidth
                          onChange={handleStudentDataChange}
                          value={studentData.name}
                          name="name"
                        />
                        <TextField
                          label="URN"
                          placeholder="Ex. 123412341234"
                          fullWidth
                          onChange={handleStudentDataChange}
                          value={studentData.urn}
                          name="urn"
                        />
                        <TextField
                          label="Email"
                          placeholder="Ex. jone.doe@mail.com"
                          fullWidth
                          onChange={handleStudentDataChange}
                          value={studentData.email}
                          name="email"
                        />
                        <TextField
                          select
                          label="Department"
                          fullWidth
                          onChange={handleStudentDataChange}
                          value={studentData.department}
                          name="department"
                        >
                          {dept.map((d) => (
                            <MenuItem value={d} key={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          select
                          label="Year"
                          onChange={handleStudentDataChange}
                          value={studentData.year}
                          name="year"
                          fullWidth
                        >
                          {year.map((y) => (
                            <MenuItem value={y} key={y}>
                              {y}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          select
                          label="Semester"
                          onChange={handleStudentDataChange}
                          value={studentData.semester}
                          name="semester"
                          fullWidth
                        >
                          {semester.map((s) => (
                            <MenuItem value={s} key={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>

                        <div className="flex w-full gap-5">
                          <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={apiCalled}
                          >
                            Add Student
                          </Button>
                          <Button
                            onClick={() => setStudentData(initialStudent)}
                            variant="outlined"
                            color="warning"
                            fullWidth
                          >
                            Cancle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Backdrop>
              </Modal>
            </>
          )}
          {studentOption !== 0 && studentOption === 2 && (
            <>
              <Modal open={option === 1} onClose={() => setOption(0)}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <div className="w-1/2 lg:h-max xs:h-5/6 sm:w-4/5 xs:w-4/5 p-10 rounded-lg sm:h-3/4 md:h-3/4  relative lg:flex-nowrap bg-gray-200/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={handleCloseBackdrop}
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        <CloseIcon />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4 w-4/5">
                      <div className="text-2xl text-center font-main text-gray-800">
                        Add Multiple Students VIA CSE Sheet
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <TextField disabled fullWidth value={fileName} />
                          {fileName !== "No file selected." && (
                            <>
                              <Button
                                onClick={handleUnloadFile}
                                variant="contained"
                                color="error"
                                size="large"
                              >
                                <DeleteIcon fontSize="large" />
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-4">
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
                          >
                            Upload File
                            <input
                              onChange={handleFileUpload}
                              type="file"
                              accept=".csv"
                              hidden
                            />
                          </Button>
                          {fileName !== "No file selected." && (
                            <>
                              <Button
                                onClick={handleMultipleStudentAdd}
                                variant="contained"
                                fullWidth
                                color="success"
                                size="large"
                                disabled={apiCalled}
                              >
                                Proceed
                              </Button>
                              <Button size="small" onClick={handleViewData}>
                                Click Here To Varify Data
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Backdrop>
              </Modal>
            </>
          )}
          {teacherOption !== 0 && teacherOption === 1 && (
            <>
              <Modal open={option === 2} onClose={() => setOption(0)}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-3/5 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-300/70 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={handleCloseBackdrop}
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        <CloseIcon />
                      </Button>
                    </div>

                    <div className="flex w-full">
                      <div className="flex gap-5 w-full xs:flex-wrap sm:flex-wrap xs:gap-2 sm:gap:2">
                        <TextField
                          label="Name"
                          placeholder="Ex. Jone Doe"
                          fullWidth
                          onChange={handleTeacherDataChange}
                          value={teacherData.name}
                          name="name"
                        />
                        <TextField
                          label="Employee ID"
                          placeholder="Ex. CSE123"
                          fullWidth
                          onChange={handleTeacherDataChange}
                          value={teacherData.empId}
                          name="empId"
                        />
                        <TextField
                          label="Email"
                          placeholder="Ex. jone.doe@mail.com"
                          fullWidth
                          onChange={handleTeacherDataChange}
                          value={teacherData.email}
                          name="email"
                        />
                        <TextField
                          select
                          label="Department"
                          fullWidth
                          onChange={handleTeacherDataChange}
                          value={teacherData.department}
                          name="department"
                        >
                          {dept.map((d) => (
                            <MenuItem value={d} key={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </TextField>
                        <div className="flex w-full gap-5">
                          <Button
                            onClick={handleSubmitTeacher}
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={apiCalled}
                          >
                            Add Teacher
                          </Button>
                          <Button
                            onClick={() => setTeacherData(initialTeacher)}
                            variant="outlined"
                            color="warning"
                            fullWidth
                          >
                            Cancle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Backdrop>
              </Modal>
            </>
          )}
          {teacherOption !== 0 && teacherOption === 2 && (
            <>
              <Modal open={option === 2} onClose={() => setOption(0)}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <div className="w-1/2 lg:h-max xs:h-5/6 sm:w-4/5 xs:w-4/5 p-10 rounded-lg sm:h-3/4 md:h-3/4  relative lg:flex-nowrap bg-gray-200/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={handleCloseBackdrop}
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        <CloseIcon />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4 w-4/5">
                      <div className="text-2xl text-center font-main text-gray-800">
                        Add Multiple Teachers VIA CSE Sheet
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <TextField disabled fullWidth value={fileName} />
                          {fileName !== "No file selected." && (
                            <>
                              <Button
                                onClick={handleUnloadFile}
                                variant="contained"
                                color="error"
                                size="large"
                              >
                                <DeleteIcon fontSize="large" />
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-4">
                          <Button
                            variant="contained"
                            component="label"
                            fullWidth
                          >
                            Upload File
                            <input
                              onChange={handleFileUploadTeacher}
                              type="file"
                              accept=".csv"
                              hidden
                            />
                          </Button>
                          {fileName !== "No file selected." && (
                            <>
                              <Button
                                onClick={handleMultpleTeacherAdd}
                                variant="contained"
                                fullWidth
                                color="success"
                                size="large"
                                disabled={apiCalled}
                              >
                                Proceed
                              </Button>
                              <Button size="small" onClick={handleViewData}>
                                Click Here To Varify Data
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Backdrop>
              </Modal>
            </>
          )}
        </div>
      </div>
    </>
  );
}
