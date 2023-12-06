import { useState, useEffect } from "react";
import Papa from "papaparse";

import Heading from "../../Common/Heading";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import { useLocation } from "react-router-dom";
import { fetchStudentBySectionAndSemester } from "../../../../api/teacher";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const MonthsOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AddAttandanceClass() {
  const url = useLocation().pathname.split("/");

  const cls = url[5];
  const dept = url[2];
  const [subjectShortName, section, semester] = url[5].split("_");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [students, setStudents] = useState([]);

  const [month, setMonth] = useState("");
  const [fileName, setFileName] = useState("");
  const [attandanceData, setAttandanceData] = useState(null);

  useEffect(() => {
    document.title = `Add Attandace For ${cls}`;
  }, []);

  useEffect(() => {
    fetchStudentBySectionAndSemester(dept, section, semester).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setStudents(res.students);
    });
  }, []);

  if (students.length === 0) {
    return (
      <center className="text-white">
        <div className="flex items-center justify-center h-full flex-col">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800 border-solid"></div>
          Loading
        </div>
      </center>
    );
  }

  function saveStudentsAttandance() {
    console.log("attandance data", console.table(attandanceData));
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

        setAttandanceData(() => res.data);
      },
    });
  }

  function handleAttandedClasses(e, student) {
    setStudents((students) =>
      students.map((stu) => {
        if (student.urn === stu.urn) {
          return {
            ...stu,
            totalAttandance: [
              ...stu.totalAttandance,
              {
                totalClassesAttended: e.target.value,
              },
            ],
          };
        }
        return stu;
      })
    );
    console.log("====================================");
    console.log(student);
    console.log("====================================");
  }
  function handleTotalAttandanceChange(e, student) {
    console.log(e.target.value);
    console.log(student);
  }

  return (
    <>
      <ErrSuccSnackbar
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <div
        className="w-4/5 flex justify-middle align-middle border-rounded p-2
      lg:mt-4 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 "
      >
        <Heading headingTitle={`Add Attandance To ${cls}`} />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#CCC8AA" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} colSpan={3}>
                  SUBJECT NAME :: {subjectShortName}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} colSpan={2}>
                  SECTION :: {section}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} colSpan={3}>
                  SEMESTER :: {semester}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                  Months::
                </TableCell>
                <TableCell colSpan={1}>
                  <TextField
                    size="small"
                    select
                    fullWidth
                    value={month === "" ? "" : month}
                    label="Choose Month Of Attendance"
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {MonthsOptions.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell colSpan={2}>
                  {fileName === "" ? "No File Selected." : fileName}
                </TableCell>
                <TableCell colSpan={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    component="label"
                    disabled={month === "" || fileName !== ""}
                    sx={{ width: "70%", marginX: "15%" }}
                  >
                    Upload CSV
                    <input
                      onChange={handleFileUpload}
                      type="file"
                      accept=".csv"
                      hidden
                    />
                  </Button>
                </TableCell>
                <TableCell colSpan={2}>
                  {fileName !== "" && (
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      color="success"
                      variant="contained"
                      size="small"
                      onClick={saveStudentsAttandance}
                    >
                      <UploadFileIcon />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                  S.No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                  CRN
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>URN</TableCell>
                <TableCell sx={{ width: "15%", fontWeight: "bold" }}>
                  Total Attended Classes
                </TableCell>
                <TableCell sx={{ width: "15%", fontWeight: "bold" }}>
                  Total Classes
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Percentage</TableCell>

                <TableCell sx={{ width: "5%", fontWeight: "bold" }}>
                  Save
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, idx) => (
                <TableRow key={student._id}>
                  <TableCell>{idx + 1}.</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.crn}</TableCell>
                  <TableCell>{student.urn}</TableCell>
                  <TableCell>
                    <TextField
                      disabled={month === ""}
                      size="small"
                      onChange={(e) => handleAttandedClasses(e, student)}
                      label="Classes Attended"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={month === ""}
                      size="small"
                      label="Total Classes"
                      onChange={(e) => handleTotalAttandanceChange(e, student)}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => console.log(student)}
                      size="small"
                      disabled={true}
                      color="secondary"
                    >
                      <CheckIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
