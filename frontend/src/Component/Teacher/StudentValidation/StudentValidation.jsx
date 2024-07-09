/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { format } from "date-fns";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import UnauthorizedPage from "../../Common/UnauthorizedPage";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  fetchStudentDetailsAPI,
  fetchStudentsByTGAPI,
  verifySingleStudentAPI,
} from "../../../../api/teacher";

function StudentValidation() {
  const isTG = jwtDecode(localStorage.getItem("authToken")).isTG || false;
  const teacherId = jwtDecode(localStorage.getItem("authToken")).id || "";

  const [students, setStudents] = useState([]);
  const [rollNumber, setRollNumber] = useState("-1");
  const [apiCalled, setApiCalled] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (students.length === 0) {
      setApiCalled(false);
      fetchStudentsByTGAPI(teacherId)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setSuccessMessage(res.message);
          setStudents(res.students);
        })
        .catch((err) => {
          setApiCalled(err.message);
        })
        .finally(() => {
          setApiCalled(false);
        });
    }
  }, [isTG]);

  function verifyStudent(rollNumber) {
    //! will make api call to verify that student in the database
    setWarningMessage("Studen verification under process.");
    setRollNumber(-1);
    verifySingleStudentAPI(rollNumber)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        //* make the change in the table as well
        setStudents.map((student) => {
          if (student.urn === rollNumber) return { ...student, verified: true };
          return { ...student };
        });
      })
      .catch((err) => setErrorMessage(err))
      .finally(() => setApiCalled(false));
  }

  function viewStudentDetails(rollNumber) {
    setRollNumber(rollNumber);
  }

  return (
    <Wrapper>
      <ErrSuccSnackbar
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        warningMessage={warningMessage}
        setWraningMessage={setWarningMessage}
      />
      <Heading>Validate Students</Heading>
      {!isTG ? (
        <UnauthorizedPage />
      ) : (
        <>
          <div className="flex flex-col rounded-md overflow-hidden">
            <div className="bg-zinc-200/20 px-2 min-h-[15vh] py-2 ">
              <div className="flex flex-col rounded-md overflow-hidden">
                <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
                  <span className="my-auto underline underline-offset-2 font-semibold">
                    All Students Under You
                  </span>
                </div>
                <div className="bg-zinc-200/20 min-h-[50vh] py-2 px-1 overflow-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400 rounded-md overflow-hidden">
                    <thead className="text-sm text-zinc-900 uppercase dark:bg-zinc-800/80 dark:text-zinc-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S. No.
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Student Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sem / Sec
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Roll Number
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/6">
                          Details Filled
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/6">
                          Verify
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:text-zinc-200">
                      {students.length !== 0 &&
                        students.map((student, idx) => (
                          <TableRow
                            key={idx}
                            ind={idx}
                            studentName={student.name}
                            semester={student.semester}
                            section={student.section}
                            rollNumber={student.urn}
                            detailsFilled={student.isDetailsFilled}
                            verified={student.verified}
                            verifyStudent={verifyStudent}
                            viewStudentDetails={viewStudentDetails}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
                {rollNumber !== "-1" && (
                  <BackdropComponent
                    rollNumber={rollNumber}
                    setRollNumber={setRollNumber}
                    verifyStudent={verifyStudent}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}

function TableRow({
  ind,
  studentName,
  rollNumber,
  section,
  semester,
  detailsFilled,
  verified,
  verifyStudent,
  viewStudentDetails,
}) {
  return (
    <>
      <tr className="odd:dark:bg-zinc-700/60 even:bg-zinc-300/80 even:dark:bg-zinc-800 border-b dark:border-zinc-700 px-0 py-0 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/80">
        <td className="px-6 py-2 font-semibold">{ind + 1}.</td>
        <th
          scope="row"
          className="px-6 py-2 font-medium text-zinc-900 whitespace-nowrap dark:text-white text-md"
        >
          {studentName}
        </th>
        <td className="px-6 py-2">{semester + " / " + section}</td>
        <td className="px-6 py-2">{rollNumber}</td>
        <td align="center" className="px-6 py-2">
          {detailsFilled ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
        </td>
        <td className="px-6 py-2">
          {verified ? (
            <button
              disabled
              className="py-1 w-full border px-3 rounded-md bg-green-600 font-semibold cursor-not-allowed"
            >
              ✔️ Verified
            </button>
          ) : !detailsFilled ? (
            <span className="text-red-300 text-xs">
              <InfoOutlinedIcon
                style={{
                  width: "12%",
                }}
                fontSize="small"
              />{" "}
              Details yet to be filled.
            </span>
          ) : (
            <div className="flex gap-3">
              <button
                disabled={!detailsFilled}
                onClick={() => {
                  viewStudentDetails(rollNumber);
                }}
                className={
                  detailsFilled
                    ? "hover:bg-gray-500 rounded-full px-1 transition"
                    : "cursor-not-allowed"
                }
              >
                <RemoveRedEyeOutlinedIcon />
              </button>
              <button
                disabled={!detailsFilled}
                id="verifyButton"
                className="py-1 border px-3 rounded-md bg-gray-600 font-semibold flex-1 hover:bg-gray-800/90 transition"
                onClick={() => {
                  verifyStudent(rollNumber);
                }}
              >
                Verify
              </button>
            </div>
          )}
        </td>
      </tr>
    </>
  );
}

function BackdropComponent({ rollNumber, setRollNumber, verifyStudent }) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);

  useEffect(() => {
    setApiCalled(true);
    fetchStudentDetailsAPI(rollNumber)
      .then((res) => setStudentDetails(res.studentData))
      .catch((err) => alert(err.message))
      .finally(() => setApiCalled(false));
  }, [rollNumber]);

  function handleCloseBackdrop() {
    setRollNumber(() => "-1");
  }

  if (apiCalled || !studentDetails) {
    return (
      <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
        <div className="flex mt-10 justify-center items-center h-[100%]">
          <div className="bg-gray-100/40 lg:h-5/6 md:h-2/3 xs:overflow-auto lg:w-2/3 md:w-2/3 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
            {/* CLOSE BUTTON */}
            <div className="flex items-between justify-end">
              <button
                onClick={handleCloseBackdrop}
                className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
              >
                <CloseIcon color="error" />
              </button>
            </div>
            <div className="flex justify-center items-center h-1/2">
              <div className="flex flex-row gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.2s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.4s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-6s]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex mt-10 justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 lg:h-5/6 md:h-2/3 xs:overflow-auto lg:w-2/3 md:w-2/3 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={handleCloseBackdrop}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>

          <Heading>
            {studentDetails.studentBasicDetails.name}&apos;s Details
          </Heading>

          {/* MAIN Student Details FOR INPUT */}
          <div className="flex px-5 flex-col mt-2">
            <div className="flex flex-1 justify-center">
              <img
                src={`data:image/jpeg;base64,${studentDetails.profilePhoto}`}
                alt="studnet name"
                className="rounded-full aspect-square"
                width={150}
              />
            </div>
            <div className="text-lg  px-2 mt-3 grid gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
              <div className="truncate border-b-2 hover:bg-gray-200 rounded-md">
                <strong>Name: </strong>{" "}
                {studentDetails.studentBasicDetails.name}
              </div>
              <div className=" border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Email: </strong>{" "}
                {studentDetails.studentBasicDetails.email}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>URN: </strong> {studentDetails.studentBasicDetails.urn}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>CRN: </strong> {studentDetails.studentBasicDetails.crn}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Mobile: </strong>{" "}
                {studentDetails.studentDetails.studentMobileNumber}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Department: </strong>{" "}
                {studentDetails.studentBasicDetails.department}
              </div>
              <div className=" border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Admission No.: </strong>{" "}
                {studentDetails.studentDetails.admissionNumber}
              </div>
              <div className="truncate  border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Sem / Sec: </strong>{" "}
                {studentDetails.studentBasicDetails.semester} /{" "}
                {studentDetails.studentBasicDetails.section}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>DOB: </strong>{" "}
                {format(
                  new Date(studentDetails.studentDetails.dob),
                  "dd-MM-yyyy"
                )}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Blood Group: </strong>{" "}
                {studentDetails.studentDetails.bloodGroup}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Category: </strong>{" "}
                {studentDetails.studentDetails.category}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Gender: </strong>{" "}
                {studentDetails.studentDetails.gender.charAt(0).toUpperCase() +
                  studentDetails.studentDetails.gender.slice(1)}
              </div>
              <div className="truncate border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Aadhar: </strong>{" "}
                {studentDetails.studentDetails.aadharNumber}
              </div>
              <div className="truncate border-b-2 flex items-center hover:bg-gray-200/20 rounded-md">
                <strong>F. Name: </strong> &nbsp;
                <div className="flex flex-col overflow-auto no-scrollbar">
                  <div>{studentDetails.studentDetails.fatherName}</div>
                  <div className="text-sm my-0">
                    +91 {studentDetails.studentDetails.fatherMobileNumber}
                  </div>
                </div>
              </div>
              <div className="truncate flex items-center border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>M. Name: </strong> &nbsp;
                <div className="flex flex-col">
                  <div>{studentDetails.studentDetails.motherName}</div>
                  <div className="text-sm my-0">
                    +91 {studentDetails.studentDetails.motherMobileNumber}
                  </div>
                </div>
              </div>
              <div className="border-b-2 hover:bg-gray-200/20 rounded-md">
                <strong>Address:</strong>{" "}
                {studentDetails.studentDetails.permanentAddress.address +
                  ", " +
                  studentDetails.studentDetails.permanentAddress.state +
                  " - " +
                  studentDetails.studentDetails.permanentAddress.pinCode}
              </div>
            </div>
          </div>

          {/* CLOSE AND VERIFY BUTTON */}
          <div className="flex justify-around lg:my-6 md:my-6 sm:my-5 gap-5 mx-10 xs:my-5">
            <button
              onClick={() => verifyStudent(rollNumber)}
              className="border bg-green-700/70 hover:text-gray-100 hover:bg-green-700/90 transition px-8 flex-1 py-1 font-semibold rounded-md "
            >
              Verify
            </button>
            <button
              onClick={() => setRollNumber(() => "-1")}
              className="border bg-red-700/70 hover:text-gray-100 transition hover:bg-red-700/90 px-8 py-1 font-semibold rounded-md "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentValidation;
