import { useEffect, useState } from "react";
import {
  assignMultipleStudentsTG,
  assignSingleStudentTG,
  fetchDeptStudents,
  fetchDeptTGs,
} from "../../../../../api/deptAdmin";
import { useLocation } from "react-router-dom";
import {
  Alert,
  Snackbar,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";

export default function AssignTgToStudent() {
  const dept = useLocation().pathname.split("/")[2];
  const [apiCalled, setApiCalled] = useState(false);
  const [students, setStudents] = useState([]);
  const [TGNames, setTGNames] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [commonTG, setCommonTG] = useState(null);

  useEffect(() => {
    if (students.length === 0) {
      fetchDeptStudents(dept)
        .then((res) => setStudents(res.students))
        .catch((err) => setErrorMessage(err.message));
    }
    if (TGNames.length === 0) {
      fetchDeptTGs(dept)
        .then((res) => {
          const temptgname = res.tgs.map((tg) => tg.name + "-" + tg.empId);
          setTGNames(temptgname);
        })
        .catch((err) => setErrorMessage(err.message));
    }
  }, [dept]);
  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelectedStudents(students);
      return;
    }
    setSelectedStudents([]);
    return;
  }
  function handleSelectSingle(e, student) {
    if (e.target.checked) {
      setSelectedStudents((selectedStudents) => [...selectedStudents, student]);
      return;
    }
    setSelectedStudents((students) =>
      students.filter((stu) => stu.urn !== student.urn)
    );
    return;
  }
  function handleChangeSingleTGSelect(e, student) {
    setStudents((students) =>
      students.map((stu) => {
        if (student.urn === stu.urn) {
          return { ...stu, selectedTG: e.target.value };
        }
        return stu;
      })
    );
  }
  function handleSingleStudentTGAssign(student) {
    setApiCalled(true);

    assignSingleStudentTG({ student })
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setStudents((students) =>
          students.map((stu) => {
            if (student.urn === stu.urn) {
              return { ...stu, tgAssigned: student.selectedTG };
            }
            return stu;
          })
        );
      })
      .catch((err) => setErrorMessage(err.message));
  }

  function handleMultipleStudentsTGAssign() {
    if (commonTG === null) {
      setErrorMessage("Select From Above Menu TG.");
      return;
    }
    setApiCalled(true);
    assignMultipleStudentsTG({ selectedStudents, commonTG })
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setStudents((students) =>
          students.map((stu) => {
            if (selectedStudents.includes(stu)) {
              return { ...stu, tgAssigned: commonTG, selectedTG: commonTG };
            }
            return stu;
          })
        );
        setSelectedStudents([]);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }
  console.log(students);
  return (
    <>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={3200}
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
        autoHideDuration={3200}
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
            Assign TG To Students
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="flex w-full">
          {" "}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
                <TableRow>
                  <TableCell colSpan={selectedStudents.length > 0 ? 5 : 9}>
                    <i>
                      <b>
                        {selectedStudents.length > 0
                          ? `${selectedStudents.length} Students Selected To Assign A TG.`
                          : "No Students Selected."}
                      </b>
                    </i>
                  </TableCell>
                  {selectedStudents.length > 0 && (
                    <>
                      <TableCell colSpan={3} align="center">
                        <TextField
                          fullWidth
                          size="small"
                          select
                          label="Select TG"
                          onChange={(e) => {
                            setCommonTG(e.target.value);
                          }}
                        >
                          {TGNames.length !== 0 &&
                            TGNames.map((tg) => (
                              <MenuItem value={tg} key={tg}>
                                {tg}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          onClick={handleMultipleStudentsTGAssign}
                          disabled={apiCalled}
                        >
                          {apiCalled ? "Assigning..." : "Assign"}
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>
                    <b>
                      <Checkbox onChange={handleSelectAll} size="small" />
                      Select
                    </b>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <b>URN</b>
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}>
                    <b>CRN</b>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <b>Name</b>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <b>Email</b>
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}>
                    <b>Semester</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "7%" }}>
                    <b>TG Assigned</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "25%" }}>
                    <b>Assign TG</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "25%" }}>
                    <b>Save</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 && (
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
                {students.length !== 0 && students.length === 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex w-full justify-center">
                          No Result Found
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {students.map((student) => (
                  <TableRow key={student.urn}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student)}
                        onChange={(e) => handleSelectSingle(e, student)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{student.urn}</TableCell>
                    <TableCell>{student.crn}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.semester}</TableCell>

                    <TableCell align="center">
                      {student.tgAssigned !== "" ? (
                        <CheckCircleTwoToneIcon
                          fontSize="small"
                          color="success"
                        />
                      ) : (
                        <CancelTwoToneIcon fontSize="small" color="error" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        fullWidth
                        size="small"
                        select
                        label="Select TG"
                        onChange={(e) => handleChangeSingleTGSelect(e, student)}
                        value={student?.selectedTG || student.tgAssigned}
                      >
                        {TGNames.length !== 0 &&
                          TGNames.map((tg) => {
                            return (
                              <MenuItem value={tg} key={tg}>
                                {tg}
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleSingleStudentTGAssign(student)}
                        color="success"
                        disabled={
                          student.selectedTG === undefined ||
                          student.selectedTG === student.tgAssigned
                        }
                      >
                        <PersonAddTwoToneIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
//state usme store if select data change to array me store
