import { useState } from "react";
import { useLocation } from "react-router-dom";
import ErrSuccSnackbar from "../../../Common/ErrSuccSnackbar";
import Heading from "../../../Common/Heading";
import {
  Backdrop,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  addTimeTable,
  fetchCoursesByDeptAndSemester,
  fetchTimeTableAdmin,
} from "../../../../../api/deptAdmin";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloseIcon from "@mui/icons-material/Close";

const SECTION = ["A", "B", "DS", "AI"];
const SEMESTER = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const TIME_SLOT = [
  "10:00 - 10:50",
  "10:50 - 11:40",
  "11:40 - 12:30",
  "12:30 - 01:20",
  "01:20 - 02:10",
  "02:10 - 03:00",
  "03:00 - 03:50",
  "03:50 - 04:40",
];
const TIME_SLOT_2 = [
  "10:00 - 10:50",
  "10:50 - 11:40",
  "11:40 - 12:30",
  "12:30 - 01:20",
  "02:10 - 03:00",
  "03:00 - 03:50",
  "03:50 - 04:40",
];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let INITIAL_TIME_TABLE = [
  // - for monday index = 0
  [
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
  ],
  // - for tuesday index = 1
  [
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },

    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
  ],
  // - for wednesday index = 2
  [
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
  ],
  // - for thursday index = 3
  [
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
    {
      teacherName: "",
      teacherId: "",
      subjectShortName: "",
    },
  ],
  // - for friday index = 4
  [
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
  ],
  // - for saturday index = 5
  [
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
    {
      teacherId: "",
      teacherName: "",
      subjectShortName: "",
    },
  ],
];

export default function TimeTableManagement() {
  const dept = useLocation().pathname.split("/")[2];
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [searchData, setSearchData] = useState({
    section: "",
    semester: "",
  });
  const [courses, setCourses] = useState(null);
  const [tt, setTt] = useState(null);
  const [timeTable, setTimeTable] = useState(null);

  function handleSearchTimeTable() {
    if (searchData.section === "" || searchData.semester === "") {
      setErrorMessage("* All fields are requires.");
      return;
    }
    setSearchData({ ...searchData, department: dept });
    fetchTimeTableAdmin(searchData, dept)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setDataFetched(true);
        if (res.timeTableExists) {
          setSuccessMessage(res.message);
          setTimeTable(res.timeTable);
          return;
        }
        fetchCoursesByDeptAndSemester(searchData.semester, dept).then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setCourses(res.courses);
        });
      })
      .catch((err) => console.log(err));
  }

  function handleClick(day, idx, ind) {
    setTt({ day: idx, slot: ind, type: "course" });
  }

  function handleSubjectChange(e) {
    INITIAL_TIME_TABLE[tt.day][tt.slot] = {
      subjectShortName: e.target.value,
      teacherName: "",
    };
    setTt(null);
  }
  function handleTeacherChange(e) {
    INITIAL_TIME_TABLE[tt.day][tt.slot] = {
      ...INITIAL_TIME_TABLE[tt.day][tt.slot],
      teacherName: e.target.value.teacherName,
      teacherId: e.target.value.teacherId,
    };
    setTt(null);
  }

  function handleTeacherClick(day, idx, ind) {
    setTt({ day: idx, slot: ind, type: "teacher" });
  }

  function handleRemove(day, idx, ind) {
    setTt({ day: idx, slot: ind, type: "course" });
  }

  function saveTimeTable(INITIAL_TIME_TABLE) {
    for (let i = 0; i < INITIAL_TIME_TABLE.length; i++) {
      for (let j = 0; j < INITIAL_TIME_TABLE[i].length; j++) {
        if (i === 0 && j === 4) continue;

        if (
          (INITIAL_TIME_TABLE[i][j].teacherName =
            "" ||
            !INITIAL_TIME_TABLE[i][j].teacherName ||
            INITIAL_TIME_TABLE[i][j].subjectShortName === "")
        ) {
          setErrorMessage("Please The Time Table Completely.");
          return;
        }
      }
    }
    //* making an api call to save time table to database
    addTimeTable(searchData, INITIAL_TIME_TABLE, dept).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setTimeTable(res.timeTable);
      return;
    });
  }

  return (
    <>
      <ErrSuccSnackbar
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
      <div className="w-4/5 flex justify-middle align-middle border-rounded p-2 lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 ">
        <Heading headingTitle={"Time Table Management"} />
        {!dataFetched && (
          <div className="flex gap-3 bg-gray-400 rounded-md px-10 py-5 lg:flex-nowrap md:flex-nowrap flex-wrap">
            <TextField
              label="Section"
              select
              fullWidth
              size="small"
              value={searchData.section}
              onChange={(e) =>
                setSearchData((searchData) => ({
                  ...searchData,
                  section: e.target.value,
                }))
              }
            >
              {SECTION.map((sec) => (
                <MenuItem key={sec} value={sec}>
                  {sec}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Semester"
              select
              fullWidth
              size="small"
              value={searchData.semester}
              onChange={(e) =>
                setSearchData((searchData) => ({
                  ...searchData,
                  semester: e.target.value,
                }))
              }
            >
              {SEMESTER.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </TextField>
            <div className="lg:w-1/4   xs:w-full sm:w-full flex justify-center align-middle">
              <Button
                startIcon={<SearchIcon />}
                variant="contained"
                fullWidth
                onClick={handleSearchTimeTable}
              >
                Search
              </Button>
            </div>
          </div>
        )}
        {dataFetched && !timeTable && (
          <>
            <div>
              <TableContainer component={Paper} sx={{ padding: "5px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={3}
                      >
                        <u>Section</u> :: <b>{searchData.section}</b>
                      </TableCell>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={3}
                      >
                        <u>Semester</u> :: <b>{searchData.semester}</b>
                      </TableCell>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={3}
                      >
                        <u>Department</u> :: <b>{dept}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        rowSpan={2}
                      >
                        Day
                      </TableCell>
                      {TIME_SLOT.map((t, idx) => (
                        <TableCell
                          sx={{ outline: "2px solid black" }}
                          align="center"
                          key={idx}
                        >
                          {idx + 1}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      {TIME_SLOT.map((t) => (
                        <TableCell
                          sx={{ outline: "2px solid black" }}
                          align="center"
                          key={t}
                        >
                          {t}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DAYS.map((day, idx) => (
                      <>
                        <TableRow>
                          <TableCell
                            rowSpan={2}
                            sx={{ outline: "2px solid black" }}
                          >
                            <b>{day}</b>
                          </TableCell>
                          {INITIAL_TIME_TABLE[idx].map((day, ind) => {
                            if (ind === 4 && idx === 0)
                              return (
                                <TableCell align="center">
                                  <b>Recess</b>
                                </TableCell>
                              );
                            return (
                              <TableCell align="center" key={ind}>
                                {day.subjectShortName === "" ? (
                                  <IconButton
                                    color="success"
                                    onClick={() => handleClick(day, idx, ind)}
                                  >
                                    <AutoStoriesIcon />
                                  </IconButton>
                                ) : (
                                  <div className="flex justify-between items-center">
                                    {day.subjectShortName}
                                    <IconButton size="small">
                                      <CloseIcon
                                        color="error"
                                        onClick={() =>
                                          handleRemove(day, idx, ind)
                                        }
                                        fontSize="small"
                                      />
                                    </IconButton>
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <TableRow>
                          {INITIAL_TIME_TABLE[idx].map((day, ind) => {
                            if (ind === 4 && idx === 0)
                              return (
                                <TableCell rowSpan={9} align="center">
                                  <span className="text-semibold text-xl">
                                    R <br /> E <br />
                                    C<br />
                                    E<br />
                                    S<br />S
                                  </span>
                                </TableCell>
                              );
                            return (
                              <TableCell align="center" key={ind}>
                                {day.teacherName === "" ? (
                                  <IconButton
                                    disabled={day.subjectShortName === ""}
                                    color="secondary"
                                    onClick={() =>
                                      handleTeacherClick(day, idx, ind)
                                    }
                                  >
                                    <PersonAddAltIcon fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <span className="text-xs ">
                                    {day.teacherName}
                                  </span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </>
                    ))}
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => saveTimeTable(INITIAL_TIME_TABLE)}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}

        {courses !== null && tt !== null && (
          <Modal open={tt !== null} onClose={() => setTt(null)}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={open}
            >
              <div className="lg:w-1/3 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-1/2 sm:h-2/3 xs:h-2/3 relative flex-nowrap bg-gray-200/90 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                <div className="absolute top-1 right-1">
                  <Button
                    onClick={() => setTt(null)}
                    color="error"
                    size="small"
                    variant="contained"
                  >
                    <CloseIcon />
                  </Button>
                </div>
                <div className="flex flex-col w-full h-full align-top justify-center">
                  <div className="flex flex-col gap-4 justify-between h-full">
                    <div className="text-lg font-semibold font-main text-gray-700 text-center">
                      Select {tt.type === "course" ? "Subject" : "Teacher"}
                    </div>
                    <div className="flex w-full h-full align-top flex-col gap-10">
                      {tt.type === "course" ? (
                        <TextField
                          select
                          label="Select Subject"
                          fullWidth
                          placeholder="Selected subject will be visible below."
                          onChange={handleSubjectChange}
                        >
                          {courses !== null &&
                            courses.map((course) => (
                              <MenuItem
                                key={course._id}
                                value={course.courseShortName}
                              >
                                {course.courseName} - {course.courseCode}
                              </MenuItem>
                            ))}
                        </TextField>
                      ) : (
                        <TextField
                          select
                          label="Select Teacher"
                          fullWidth
                          placeholder="Selected teacher will be visible below."
                          onChange={handleTeacherChange}
                        >
                          {courses !== null &&
                            courses.map((course) => {
                              if (
                                course.courseShortName ===
                                INITIAL_TIME_TABLE[tt.day][tt.slot]
                                  .subjectShortName
                              ) {
                                return course.taughtBy.map((tea) => (
                                  <MenuItem key={tea._id} value={tea}>
                                    {tea.teacherName}
                                  </MenuItem>
                                ));
                              }
                            })}
                        </TextField>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Backdrop>
          </Modal>
        )}

        {dataFetched && timeTable && (
          <>
            <div>
              <TableContainer component={Paper} sx={{ padding: "5px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={3}
                      >
                        <u>Section</u> :: <b>{timeTable.section}</b>
                      </TableCell>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={3}
                      >
                        <u>Semester</u> :: <b>{timeTable.semester}</b>
                      </TableCell>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        align="center"
                        colSpan={2}
                      >
                        <u>Department</u> :: <b>{timeTable.department}</b>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      <TableCell
                        sx={{ outline: "2px solid black" }}
                        rowSpan={2}
                      >
                        Day
                      </TableCell>
                      {TIME_SLOT_2.map((t, idx) => (
                        <TableCell
                          sx={{ outline: "2px solid black" }}
                          align="center"
                          key={idx}
                        >
                          {idx + 1}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#B0A695" }}>
                      {TIME_SLOT_2.map((t) => (
                        <TableCell
                          sx={{ outline: "2px solid black" }}
                          align="center"
                          key={t}
                        >
                          {t}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeTable.time_table.map((day, idx) => (
                      <>
                        <TableRow key={idx}>
                          <TableCell
                            rowSpan={2}
                            sx={{ outline: "2px solid black" }}
                          >
                            <b>{day.day}</b>
                          </TableCell>
                          {day.details.map((sub, ind) => {
                            return (
                              <TableCell align="center" key={ind}>
                                {sub.subject}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <TableRow>
                          {day.details.map((sub, ind) => {
                            return (
                              <TableCell align="center" key={ind}>
                                {sub.teacher}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}
      </div>
    </>
  );
}
