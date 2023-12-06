import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  assignMultipleTG,
  assignSingleTG,
  fetchDeptTeachers,
  removeMultipleTG,
  removeSingleTG,
} from "../../../../../api/deptAdmin";
import {
  Alert,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import PersonRemoveAlt1TwoToneIcon from "@mui/icons-material/PersonRemoveAlt1TwoTone";

export default function AssignTG() {
  const dept = useLocation().pathname.split("/")[2];
  const [teachers, setTeachers] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDeptTeachers(dept).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setTeachers(res.teachers);
      setApiData(res.teachers);
      return;
    });
  }, [dept]);
  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelectedTeachers(teachers);
      return;
    }
    setSelectedTeachers([]);
    return;
  }
  function handleSingleSelect(e, teacher) {
    if (e.target.checked) {
      setSelectedTeachers((prev) => [...prev, teacher]);
      return;
    }
    setSelectedTeachers((prev) =>
      prev.filter((tea) => teacher.empId !== tea.empId)
    );
  }
  function handleSingleTGAssign(teacher) {
    setApiCalled(true);
    assignSingleTG(teacher)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setTeachers((teachers) =>
          teachers.filter((tea) => {
            if (tea.empId !== teacher.empId) {
              return tea;
            }
            tea.isTG = true;
            return tea;
          })
        );
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setApiCalled(false);
      });
  }
  function handleSingleTGRemove(teacher) {
    setApiCalled(true);
    removeSingleTG(teacher)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setTeachers((teachers) =>
          teachers.filter((tea) => {
            if (tea.empId !== teacher.empId) {
              return tea;
            }
            tea.isTG = false;
            return tea;
          })
        );
      })
      .catch((err) => {
        setApiCalled(false);
        setErrorMessage(err.message);
      });
    return;
  }
  function handleMultipleTGAssign() {
    setApiCalled(true);
    assignMultipleTG(selectedTeachers)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setSelectedTeachers([]);
        setTeachers((teachers) =>
          teachers.filter((tea) => {
            if (!selectedTeachers.includes(tea)) {
              return tea;
            }
            tea.isTG = true;
            return tea;
          })
        );
      })
      .catch((err) => {
        setApiCalled(false);
        setErrorMessage(err.message);
      });
  }
  function handleMultipleTGRemove() {
    setApiCalled(true);
    removeMultipleTG(selectedTeachers)
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setSelectedTeachers([]);
        setTeachers((teachers) =>
          teachers.filter((tea) => {
            if (!selectedTeachers.includes(tea)) {
              return tea;
            }
            tea.isTG = false;
            return tea;
          })
        );
      })
      .catch((err) => {
        setApiCalled(false);
        setErrorMessage(err.message);
      });
  }
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
            Assign TG <span className="text-sm">(Teacher Guardian)</span>
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="flex w-full">
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
                <TableRow>
                  <TableCell colSpan={selectedTeachers.length > 0 ? 4 : 6}>
                    <i>
                      <b>
                        {selectedTeachers.length > 0
                          ? `${selectedTeachers.length} Teachers Selected To Appoint or Remove As TG.`
                          : "No Teachers Selected."}
                      </b>
                    </i>
                  </TableCell>
                  {selectedTeachers.length > 0 && (
                    <>
                      <TableCell align="center">
                        <IconButton
                          onClick={handleMultipleTGRemove}
                          color="error"
                          size="small"
                          disabled={apiCalled}
                        >
                          <PersonRemoveAlt1TwoToneIcon size="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={handleMultipleTGAssign}
                          color="success"
                          size="small"
                          disabled={apiCalled}
                        >
                          <PersonAddAltTwoToneIcon size="small" />
                        </IconButton>
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
                  <TableCell sx={{ width: "20%" }}>
                    <b>Emp ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "7%" }}>
                    <b>Is TG</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Assign</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData.length === 0 && (
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
                {apiData.length !== 0 && teachers.length === 0 && (
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
                {teachers.map((teacher) => (
                  <TableRow key={teacher.empId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTeachers.includes(teacher)}
                        onChange={(e) => handleSingleSelect(e, teacher)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{teacher.empId}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell align="center">
                      {teacher.isTG ? (
                        <CheckCircleTwoToneIcon
                          fontSize="small"
                          color="success"
                        />
                      ) : (
                        <CancelTwoToneIcon fontSize="small" color="error" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {teacher.isTG ? (
                        <IconButton
                          onClick={() => handleSingleTGRemove(teacher)}
                          color="error"
                          size="small"
                          disabled={apiCalled}
                        >
                          <PersonRemoveAlt1TwoToneIcon size="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleSingleTGAssign(teacher)}
                          color="success"
                          size="small"
                          disabled={apiCalled}
                        >
                          <PersonAddAltTwoToneIcon size="small" />
                        </IconButton>
                      )}
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
