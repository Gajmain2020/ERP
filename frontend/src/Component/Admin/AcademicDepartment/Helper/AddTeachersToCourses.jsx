import { useEffect, useState } from "react";
import ErrorSnackbar from "../../../Common/ErrorSnackbar";
import SuccessSnackbar from "../../../Common/SuccessSnackbar";
import Heading from "../../../Common/Heading";
import {
  addTeacherToCourse,
  fetchCoursesByDept,
  fetchDeptTeachers,
} from "../../../../../api/deptAdmin";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableContainer,
  Paper,
  Modal,
  Button,
  Backdrop,
  MenuItem,
  TextField,
} from "@mui/material";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import CloseIcon from "@mui/icons-material/Close";

export default function AddTeachersToCourses() {
  const dept = useLocation().pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [mode, setMode] = useState("course");
  const [teacher, setTeacher] = useState(null);
  const [course, setCourse] = useState(null);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    if (courses.length === 0) {
      fetchCoursesByDept(dept)
        .then((res) => setCourses(res.courses))
        .catch((err) => setErrorMessage(err.message));
      if (teachers.length === 0) {
        fetchDeptTeachers(dept)
          .then((res) => setTeachers(res.teachers))
          .catch((err) => setErrorMessage(err.message));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept, mode]);

  function handleSelectTeacherChange(e) {
    setSelectedTeachers((teachers) => {
      if (teachers.includes(e.target.value)) return [...teachers];
      return [...teachers, e.target.value];
    });
  }

  function removeTeacher(tea) {
    setSelectedTeachers((selectedTeachers) =>
      selectedTeachers.filter((t) => {
        if (t.name === tea.name) return;
        return tea;
      })
    );
  }
  function handleCloseBackdrop() {
    setSelectedTeachers([]);
    setSelectedCourses([]);
    setTeacher(null);
    setCourse(null);
  }

  function handleAddTeacherToCourse() {
    // - make an api call to save the data in backend
    addTeacherToCourse(selectedTeachers, course).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      courses[courses.indexOf(course)].taughtBy = [
        ...courses[courses.indexOf(course)].taughtBy,
        ...selectedTeachers.map((t) => {
          if (
            !courses[courses.indexOf(course)].taughtBy.includes({
              teacherName: t.name,
              teacherId: t.empId,
            })
          ) {
            return { teacherName: t.name, teacherId: t.empId };
          }
        }),
      ];
      setSuccessMessage(res.message);
      handleCloseBackdrop();
    });
  }

  return (
    <>
      <ErrorSnackbar
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <SuccessSnackbar
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
      <div className="w-4/5 flex justify-middle align-middle border-rounded p-2 lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 ">
        <Heading headingTitle={"Add Teachers To Courses"} />
        <div className="mb-2 flex gap-3 bg-gray-400 px-8 py-5 rounded-md">
          <div
            onClick={() => setMode("teacher")}
            className={`transition-all delay-200 ease-in-out text-slate-950 font-semibold cursor-pointer border font-main rounded-lg text-center w-1/2 border-red-500 px-4 py-2 ${
              mode === "teacher" ? "bg-cyan-400 font-bold " : ""
            }`}
          >
            Teacher
          </div>
          <div
            onClick={() => setMode("course")}
            className={`transition-all delay-200 ease-in-out text-slate-950 font-semibold cursor-pointer font-main border rounded-lg text-center w-1/2 border-red-500 px-4 py-2 ${
              mode === "course" ? "bg-cyan-400 font-bold" : ""
            }`}
          >
            Course
          </div>
        </div>
        {mode === "course" && courses.length !== 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>
                    <b>S. No.</b>
                  </TableCell>
                  <TableCell>
                    <b>Course Code</b>
                  </TableCell>
                  <TableCell>
                    <b>Course Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Short Name</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Add Teachers</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.length === 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex w-full justify-center">
                          Loading .....
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {courses.length !== 0 &&
                  courses.map((row, idx) => (
                    <>
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <b>{idx + 1}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.courseCode}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.courseName}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.courseShortName}</b>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => setCourse(row)}
                          >
                            <AddCircleTwoToneIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {row.taughtBy.length > 0 && (
                        <TableRow>
                          <TableCell></TableCell>

                          <TableCell colSpan={4}>
                            <div className="flex gap-2">
                              {row.taughtBy.map((t, idx) => (
                                <>
                                  <div>
                                    <b>{idx + 1}</b>. {t.teacherName} -{" "}
                                    {t.teacherId}
                                  </div>
                                  ||
                                </>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {mode === "course" && course !== null && (
          <Modal open={course !== null} onClose={handleCloseBackdrop}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={open}
            >
              <div className="w-1/3 sm:w-3/5 xs:w-4/5 p-10 rounded-lg lg:h-3/4 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-300/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap text-black">
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
                <div className="flex flex-col gap-4 justify-between h-full">
                  <div className="text-lg font-semibold font-main">
                    Add Teachers To Course :: {course.courseCode}
                  </div>
                  <div className="">
                    <TextField
                      select
                      label="Select Teacher"
                      fullWidth
                      placeholder="Selected teacher will be visible below."
                      onChange={handleSelectTeacherChange}
                    >
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher}>
                          {teacher.name} - {teacher.empId}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selectedTeachers.length !== 0 ? (
                      selectedTeachers.map((t, idx) => (
                        <>
                          <div key={idx} className="flex justify-between">
                            <div>
                              {idx + 1}. {t.name} - {t.empId}
                            </div>
                            <div
                              onClick={() => removeTeacher(t)}
                              className="cursor-pointer"
                            >
                              <CloseIcon fontSize="small" />
                            </div>
                          </div>
                        </>
                      ))
                    ) : (
                      <div className="text-md text-gray-700">
                        * No teachers selected.
                      </div>
                    )}
                  </div>
                  {selectedTeachers.length !== 0 && (
                    <>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          onClick={handleCloseBackdrop}
                          color="warning"
                          fullWidth
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={handleAddTeacherToCourse}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Backdrop>
          </Modal>
        )}

        {mode === "teacher" && teachers.length !== 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>
                    <b>S. No.</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Emp ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Add Course</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.length === 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex w-full justify-center">
                          Loading .....
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {teachers.length !== 0 &&
                  teachers.map((row, idx) => (
                    <>
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <b>{idx + 1}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.name}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.empId}</b>
                        </TableCell>
                        <TableCell>
                          <b>{row.email}</b>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => setTeacher(row)}
                          >
                            <AddCircleTwoToneIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {row.subjectsTaken.length > 0 && (
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell colSpan={4}>
                            <div className="flex gap-2">
                              {row.subjectsTakene.map((t, idx) => (
                                <>
                                  <div>
                                    <b>{idx + 1}</b>. {t.teacherName} -{" "}
                                    {t.teacherId}
                                  </div>
                                  ||
                                </>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {mode === "teacher" && teacher !== null && (
          <Modal open={course !== null} onClose={handleCloseBackdrop}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={open}
            >
              <div className="w-1/3 sm:w-3/5 xs:w-4/5 p-10 rounded-lg lg:h-3/4 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-300/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap text-black">
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
                <div className="flex flex-col gap-4 justify-between h-full">
                  <div className="text-lg font-semibold font-main">
                    Add Teachers To Course :: {course.courseCode}
                  </div>
                  <div className="">
                    <TextField
                      select
                      label="Select Teacher"
                      fullWidth
                      placeholder="Selected teacher will be visible below."
                      onChange={handleSelectTeacherChange}
                    >
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher}>
                          {teacher.name} - {teacher.empId}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selectedTeachers.length !== 0 ? (
                      selectedTeachers.map((t, idx) => (
                        <>
                          <div key={idx} className="flex justify-between">
                            <div>
                              {idx + 1}. {t.name} - {t.empId}
                            </div>
                            <div
                              onClick={() => removeTeacher(t)}
                              className="cursor-pointer"
                            >
                              <CloseIcon fontSize="small" />
                            </div>
                          </div>
                        </>
                      ))
                    ) : (
                      <div className="text-md text-gray-700">
                        * No teachers selected.
                      </div>
                    )}
                  </div>
                  {selectedTeachers.length !== 0 && (
                    <>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          onClick={handleCloseBackdrop}
                          color="warning"
                          fullWidth
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={handleAddTeacherToCourse}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Backdrop>
          </Modal>
        )}
      </div>
    </>
  );
}

//need to get all the courses then need to add teachers to them
