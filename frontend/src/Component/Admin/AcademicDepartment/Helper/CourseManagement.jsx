import { useState } from "react";
import ErrorSnackbar from "../../../Common/ErrorSnackbar";
import SuccessSnackbar from "../../../Common/SuccessSnackbar";
import Heading from "../../../Common/Heading";
import {
  Button,
  Backdrop,
  Modal,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { addSingleCourse } from "../../../../../api/deptAdmin";

const semester = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const initialCourseDeatils = {
  courseCode: "",
  courseName: "",
  courseShortName: "",
  department: "",
  semester: "",
};

export default function CourseManagement() {
  const navigate = useNavigate();
  const dept = useLocation().pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addCourse, setAddCourse] = useState(false);
  const [courseDetails, setCourseDetails] = useState(initialCourseDeatils);

  function handleCloseBackdrop() {
    setAddCourse(false);
    setCourseDetails(initialCourseDeatils);
  }
  function handleCourseDetailsChange(e) {
    setCourseDetails((courseDetails) => ({
      ...courseDetails,
      [e.target.name]: e.target.value,
    }));
  }

  function addCourseInDB() {
    if (
      dept === "" ||
      courseDetails.courseCode === "" ||
      courseDetails.courseName === "" ||
      courseDetails.courseShortName === "" ||
      courseDetails.semester === ""
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
    addSingleCourse({ ...courseDetails, department: dept }).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setCourseDetails(initialCourseDeatils);
      setAddCourse(false);

      return;
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
        <Heading headingTitle={"Course Management Module"} />
        <div className="w-full mt-4">
          <div className=" mx-auto bg-gray-100/50 p-6 rounded-md shadow-md">
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                    onClick={() => setAddCourse(true)}
                  >
                    Add Course
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                    onClick={() => navigate("edit-course")}
                  >
                    View / Edit Courses
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
                    onClick={() => navigate("add-teachers-to-courses")}
                  >
                    Add Teachers For Courses
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*!!!!!!! ADD COURSES BACKDROP */}
      {addCourse && (
        <Modal open={addCourse} onClose={() => setAddCourse(false)}>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
          >
            <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-2/3 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-200/50 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
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
              <div className="xs:hidden s:hidden md:flex flex-col gap-10 align-middle justify-center w-full h-full">
                <Table size="small">
                  <TableBody sx={{ border: "2px solid black" }}>
                    <TableRow sx={{ border: "none " }}>
                      <TableCell sx={{ width: "12%" }}>
                        <b>Course Code:</b>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          name="courseCode"
                          label="Course Code"
                          color="warning"
                          onChange={handleCourseDetailsChange}
                          value={courseDetails.courseCode}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderLeft: "2px solid black",
                          color: "black",
                          width: "12%",
                        }}
                      >
                        <b>Short Name:</b>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          name="courseShortName"
                          label="Course Short Name"
                          color="warning"
                          onChange={handleCourseDetailsChange}
                          value={courseDetails.courseShortName}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderLeft: "2px solid black",
                          color: "black",
                          width: "10%",
                        }}
                      >
                        <b>Semester:</b>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <TextField
                          size="small"
                          fullWidth
                          name="semester"
                          color="warning"
                          select
                          onChange={handleCourseDetailsChange}
                          value={courseDetails.semester}
                        >
                          {semester.map((sem) => (
                            <MenuItem value={sem} key={sem}>
                              {sem}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ border: "none " }}>
                      <TableCell
                        sx={{
                          borderLeft: "2px solid black",
                          color: "black",
                          width: "12%",
                        }}
                      >
                        <b>Department:</b>
                      </TableCell>
                      <TableCell sx={{ cursor: "not-allowed" }}>
                        <TextField
                          size="small"
                          fullWidth
                          name="courseName"
                          label="Course Name"
                          color="warning"
                          disabled
                          value={dept}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderLeft: "2px solid black",
                          color: "black",
                          width: "12%",
                        }}
                      >
                        <b>Course Name:</b>
                      </TableCell>
                      <TableCell colSpan={3}>
                        <TextField
                          size="small"
                          fullWidth
                          name="courseName"
                          label="Course Name"
                          color="warning"
                          onChange={handleCourseDetailsChange}
                          value={courseDetails.courseName}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex gap-2">
                  <Button
                    fullWidth
                    color="success"
                    variant="contained"
                    onClick={addCourseInDB}
                  >
                    Add Course
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    variant="outlined"
                    onClick={() => setCourseDetails(initialCourseDeatils)}
                  >
                    <b>Clear</b>
                  </Button>
                </div>
              </div>
              {/* For small screen devices like mobile phones */}
              <div className="lg:hidden md:hidden flex mt-10 text-sm">
                <div className="flex justify-center">
                  <span>hello:</span>
                  <span>
                    <TextField />
                  </span>
                </div>
              </div>
            </div>
          </Backdrop>
        </Modal>
      )}
    </>
  );
}
