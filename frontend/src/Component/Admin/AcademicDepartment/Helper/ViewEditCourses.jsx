/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ErrorSnackbar from "../../../Common/ErrorSnackbar";
import SuccessSnackbar from "../../../Common/SuccessSnackbar";
import Heading from "../../../Common/Heading";
import {
  Modal,
  Backdrop,
  Button,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  deleteSingleCourse,
  editSingleCourse,
  fetchCoursesByDept,
} from "../../../../../api/deptAdmin";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CloseIcon from "@mui/icons-material/Close";

const semester = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function ViewEditCourses() {
  const dept = useLocation().pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    fetchCoursesByDept(dept)
      .then((res) => setCourses(res.courses))
      .catch((err) => setErrorMessage(err.message));
  }, [dept]);

  function handleDeleteSingleCourse(course) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) {
      return;
    }
    deleteSingleCourse(course._id).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setCourses((courses) => courses.filter((c) => c._id !== course._id));
      setSuccessMessage(res.message);
    });
  }

  function handleEditCourse() {
    if (check === course) {
      const confirmBackdropClose = window.confirm(
        "No change detected. Do you want to close the backdrop?"
      );
      if (confirmBackdropClose) {
        setCourse(null);
        setCheck(null);
        return;
      }
      return;
    }
    editSingleCourse(course).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setCourses((courses) =>
        courses.map((cou) => {
          if (cou._id === course._id) {
            return course;
          }
          return cou;
        })
      );
      setCourse(null);
      setSuccessMessage(res.message);
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
        <Heading headingTitle={`View/Edit ${dept} Courses`} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#D0d4ca" }}>
              <TableRow>
                <TableCell sx={{ width: "10%" }}>
                  <b>S.No.</b>
                </TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <b>Course Code</b>
                </TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <b>Course Name</b>
                </TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <b>Short Name</b>
                </TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <b>Semester</b>
                </TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {courses.map((course, idx) => (
                <TableRow key={course._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.courseShortName}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setCourse(course);
                        setCheck(course);
                      }}
                      size="small"
                      color="warning"
                    >
                      <EditTwoToneIcon />
                    </IconButton>
                    &nbsp;
                    <IconButton
                      onClick={() => handleDeleteSingleCourse(course)}
                      size="small"
                      color="error"
                    >
                      <HighlightOffTwoToneIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal open={course !== null} onClose={() => setCourse(null)}>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={open}
        >
          <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-2/5 sm:h-2/3 xs:h-2/3 relative flex-nowrap bg-gray-200/90 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
            <div className="absolute top-1 right-1">
              <Button
                onClick={() => setCourse(null)}
                color="error"
                size="small"
                variant="contained"
              >
                <CloseIcon />
              </Button>
            </div>
            <div className="flex w-full h-full flex-col gap-3">
              <div className="flex gap-3 lg:flex-nowrap md:flex-nowrap flex-wrap">
                <TextField
                  label="Course Code"
                  value={course?.courseCode}
                  name="courseCode"
                  fullWidth
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  value={course?.courseName}
                  label="Course Name"
                  name="courseName"
                  fullWidth
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-3 lg:flex-nowrap md:flex-nowrap flex-wrap">
                <TextField
                  value={course?.courseShortName}
                  label="Course Short Name"
                  name="courseShortName"
                  fullWidth
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />

                <TextField
                  select
                  label="Semester"
                  value={course?.semester}
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  name="semester"
                  fullWidth
                >
                  {semester.map((y) => (
                    <MenuItem value={y} key={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex gap-3">
                <Button
                  color="success"
                  fullWidth
                  variant="contained"
                  onClick={handleEditCourse}
                >
                  Make Change
                </Button>
                <Button
                  onClick={() => {
                    setCourse(null);
                    setCheck(null);
                  }}
                  color="error"
                  fullWidth
                  variant="outlined"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Backdrop>
      </Modal>
    </>
  );
}
