/* eslint-disable react/prop-types */
import jwtDecode from "jwt-decode";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import UnauthorizedPage from "../../Common/UnauthorizedPage";
import { useEffect, useState } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const dummyStudents = [
  {
    studentName: "John",
    rollNumber: 1,
    semester: "VI",
    section: "B",
    detailsFilled: false,
    verified: false,
  },
  {
    studentName: "ron",
    rollNumber: 2,
    semester: "VI",
    section: "B",
    detailsFilled: true,
    verified: false,
  },
  {
    studentName: "harry",
    rollNumber: 3,
    semester: "VI",
    section: "B",
    detailsFilled: true,
    verified: true,
  },
];

function StudentValidation() {
  const isTG = jwtDecode(localStorage.getItem("authToken"))._doc.isTG || false;

  const [students, setStudents] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (students.length === 0) {
      //make api call to get students details
    }
  }, [isTG]);

  function verifyStudent(rollNumber) {
    console.log("student verification");
    //make api call to verify student in the database
    console.log(rollNumber);
  }

  function viewStudentDetails(rollNumber) {
    console.log("view single student details");
    console.log(rollNumber);
  }

  return (
    <Wrapper>
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
                <div className="bg-zinc-200/20 min-h-[50vh] py-2 px-1">
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
                      {dummyStudents.map((student, idx) => (
                        <TableRow
                          key={idx}
                          ind={idx}
                          studentName={student.studentName}
                          semester={student.semester}
                          section={student.section}
                          rollNumber={student.rollNumber}
                          detailsFilled={student.detailsFilled}
                          verified={student.verified}
                          verifyStudent={verifyStudent}
                          viewStudentDetails={viewStudentDetails}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
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
      <tr className="odd:dark:bg-zinc-700/60 even:bg-zinc-300/80 cursor-pointer even:dark:bg-zinc-800 border-b dark:border-zinc-700 px-0 py-0 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/80">
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
              className="py-1 w-full border px-3 rounded-md bg-gray-600 font-semibold cursor-not-allowed"
            >
              Verified
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  viewStudentDetails(rollNumber);
                }}
                className="hover:bg-gray-500 rounded-full px-1 transition"
              >
                <RemoveRedEyeOutlinedIcon />
              </button>
              <button
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

export default StudentValidation;
