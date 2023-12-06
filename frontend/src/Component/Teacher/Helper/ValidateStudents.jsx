import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchStudentsByTG,
  verifyMultipleStudents,
  verifySingleStudent,
} from "../../../../api/teacher";
import {
  Alert,
  Snackbar,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  IconButton,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Backdrop,
  Modal,
} from "@mui/material";
import { format } from "date-fns";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CloseIcon from "@mui/icons-material/Close";
import { fetchStudentDetails } from "../../../../api/student";

export default function ValidateStudents() {
  const id = useLocation().pathname.split("/")[3];
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  //   const [openDetailsBackdrop, setOpenDetailsBackdrop] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [TG, setTG] = useState("");

  useEffect(() => {
    fetchStudentsByTG(id).then((res) => {
      setDataFetched(true);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setStudents(res.students);
      setTG(res.tg);
      return;
    });
  }, [id]);

  useEffect(() => {
    if (student !== null) {
      fetchStudentDetails(student.urn).then((res) => {
        setDataFetched(true);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setStudentDetails(res.student);
        return;
      });
    }
  }, [student]);

  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelectedStudents(
        students.filter((stu) => stu.detailsFilled && !stu.isVerified)
      );
      return;
    }
    setSelectedStudents([]);
    return;
  }

  function handleSingleSelect(e, student) {
    if (e.target.checked) {
      setSelectedStudents((stu) => [...stu, student]);
    }
    if (!e.target.checked) {
      setSelectedStudents((prev) =>
        prev.filter((stu) => student.urn !== stu.urn)
      );
    }
  }

  function handleVerifyMultipleStudents() {
    setApiCalled(true);
    verifyMultipleStudents({ selectedStudents, TG })
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
              return { ...stu, isVerified: true };
            }
            return stu;
          })
        );
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setApiCalled(false);
      });
  }

  function handleVerifySingleStudent(student) {
    setApiCalled(true);
    verifySingleStudent({ student, TG })
      .then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        setStudent(null);
        setStudentDetails(null);
        setStudents((students) =>
          students.map((stu) => {
            if (stu.urn === student.urn) {
              return { ...stu, isVerified: true };
            }
            return stu;
          })
        );
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setApiCalled(false);
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
            Validate Students
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
                  <TableCell colSpan={selectedStudents.length > 0 ? 5 : 7}>
                    <i>
                      <b>
                        {selectedStudents.length > 0
                          ? `${selectedStudents.length} Stuent(s) Selected To Verify.`
                          : "No Student(s) Selected."}
                      </b>
                    </i>
                  </TableCell>
                  {selectedStudents.length > 0 && (
                    <>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={handleVerifyMultipleStudents}
                          color="success"
                          size="small"
                          disabled={apiCalled}
                        >
                          <HowToRegIcon size="small" />
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
                    <b>URN</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Semester</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Details Filled / Verified</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Validate</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 && dataFetched && (
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
                {students.length === 0 && (
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
                        onChange={(e) => handleSingleSelect(e, student)}
                        disabled={!student.detailsFilled || student.isVerified}
                        size="small"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: student.detailsFilled && "pointer",
                      }}
                      onClick={() => setStudent(student)}
                    >
                      {student.urn}
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: student.detailsFilled && "pointer",
                      }}
                      onClick={() => setStudent(student)}
                    >
                      {student.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: student.detailsFilled && "pointer",
                      }}
                      onClick={() => setStudent(student)}
                    >
                      {student.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: student.detailsFilled && "pointer",
                      }}
                      onClick={() => setStudent(student)}
                    >
                      {student.semester}
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: student.detailsFilled && "pointer",
                      }}
                      onClick={() => setStudent(student)}
                      align="center"
                    >
                      {student.detailsFilled ? (
                        <>
                          <CheckCircleTwoToneIcon
                            fontSize="small"
                            color="success"
                          />
                          <span className="text-md"> / </span>
                          {student.isVerified ? (
                            <CheckCircleTwoToneIcon
                              fontSize="small"
                              color="success"
                            />
                          ) : (
                            <CancelTwoToneIcon fontSize="small" color="error" />
                          )}
                        </>
                      ) : (
                        <>
                          <CancelTwoToneIcon fontSize="small" color="error" />
                          <span className="text-md"> / </span>
                          <CancelTwoToneIcon fontSize="small" color="error" />
                        </>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {student.detailsFilled && !student.isVerified && (
                        <IconButton
                          onClick={() => handleVerifySingleStudent(student)}
                          color="success"
                          size="small"
                          disabled={apiCalled}
                        >
                          <HowToRegIcon size="small" />
                        </IconButton>
                      )}
                      {!student.detailsFilled && !student.isVerified && (
                        <IconButton
                          onClick={() => console.log(student)}
                          color="success"
                          size="small"
                          disabled
                        >
                          <HowToRegIcon size="small" />
                        </IconButton>
                      )}
                      {student.detailsFilled && student.isVerified && (
                        <VerifiedUserIcon size="small" color="secondary" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {student !== null && (
          <>
            <Modal open={student !== null} onClose={() => setStudent(null)}>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                {studentDetails === null && <>Loading....</>}
                {studentDetails !== null && (
                  <div className="w-1/2 lg:h-max xs:h-5/6 sm:w-4/5 xs:w-4/5 p-10 rounded-lg sm:h-3/4 md:h-3/4  relative lg:flex-nowrap bg-gray-200/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
                    <div className="absolute top-1 right-1">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => setStudent(null)}
                      >
                        <CloseIcon />
                      </Button>
                    </div>
                    <div className="flex flex-col justify-center w-full xs:h-full xs:justify-start ">
                      <div className="header text-center text-2xl text-gray-800 font-semibold underline lg:mb-5">
                        Student Details
                      </div>
                      <div className="xs:hidden s:hidden md:block ">
                        <Table size="small">
                          <TableBody sx={{ border: "2px solid black" }}>
                            <TableRow sx={{ border: "none " }}>
                              <TableCell>
                                <b>Name:</b>
                              </TableCell>
                              <TableCell>{studentDetails.name}</TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>URN:</b>
                              </TableCell>
                              <TableCell>{studentDetails.urn}</TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Email:</b>
                              </TableCell>
                              <TableCell>{studentDetails.email}</TableCell>
                            </TableRow>
                            <TableRow sx={{ border: "none " }}>
                              <TableCell>
                                <b>Semester:</b>
                              </TableCell>
                              <TableCell>{studentDetails.semester}</TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Section:</b>
                              </TableCell>
                              <TableCell>{studentDetails.section}</TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>CRN:</b>
                              </TableCell>
                              <TableCell>{studentDetails.crn}</TableCell>
                            </TableRow>
                          </TableBody>
                          <TableBody sx={{ border: "2px solid black" }}>
                            <TableRow>
                              <TableCell colSpan={6}>
                                <div className="flex justify-center text-xl text-gray-800 font-semibold">
                                  {" "}
                                  Details
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="center" colSpan={6}>
                                <div className="flex justify-center">
                                  <img
                                    src={studentDetails.details.profilePhoto}
                                    width={100}
                                    height={100}
                                    alt=""
                                    style={{ borderRadius: "50%" }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: "none " }}>
                              <TableCell sx={{ borderTop: "2px solid black" }}>
                                <b>DOB:</b>
                              </TableCell>
                              <TableCell sx={{ borderTop: "2px solid black" }}>
                                {format(
                                  new Date(studentDetails.details.dob),
                                  "dd-MM-yyyy"
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  borderTop: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Blood Group:</b>
                              </TableCell>
                              <TableCell sx={{ borderTop: "2px solid black" }}>
                                {studentDetails.details.bloodGroup}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  borderTop: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Admission Number:</b>
                              </TableCell>
                              <TableCell sx={{ borderTop: "2px solid black" }}>
                                {studentDetails.details.admissionNumber}
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: "none " }}>
                              <TableCell>
                                <b>Gender:</b>
                              </TableCell>
                              <TableCell>
                                {studentDetails.details.gender.toUpperCase()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Category:</b>
                              </TableCell>
                              <TableCell>
                                {studentDetails.details.category.toUpperCase()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Student Phone Number:</b>
                              </TableCell>
                              <TableCell>
                                {studentDetails.details.studentMobileNumber}
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: "none " }}>
                              <TableCell>
                                <b>Permanent Address:</b>
                              </TableCell>
                              <TableCell>
                                {studentDetails.details.permanentAddress}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Aadhar Number:</b>
                              </TableCell>
                              <TableCell>
                                {studentDetails.details.aadharNumber}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderLeft: "2px solid black",
                                  color: "black",
                                }}
                              >
                                <b>Guardian&apos;s Number:</b>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col w-full">
                                  <span>
                                    {
                                      studentDetails.details
                                        .guardianMobileNumber1
                                    }
                                  </span>
                                  <span>
                                    {
                                      studentDetails.details
                                        .guardianMobileNumber2
                                    }
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <div className="flex w-full mt-5 gap-3">
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleVerifySingleStudent(student)}
                            color="success"
                            disabled={student.isVerified}
                          >
                            Verify
                          </Button>
                          <Button
                            onClick={() => {
                              setStudentDetails(null);
                              setStudent(null);
                            }}
                            fullWidth
                            variant="outlined"
                            color="warning"
                          >
                            {!student.isVerified ? "Cancel" : "Close"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Backdrop>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
