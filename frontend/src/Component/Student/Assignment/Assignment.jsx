/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DownloadIcon from "@mui/icons-material/Download";
import SubmitIcon from "@mui/icons-material/Publish";
import CloseIcon from "@mui/icons-material/Close";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import SuccErrSnackbar from "../../Common/SuccErrSnackbar";

import {
  fetchStudentDetailsById,
  getAllAssignmentsAPI,
  uploadAssignmentAPI,
} from "../../../../api/student";

export default function Assignment() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [assSelected, setAssSelected] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!assignments.length) {
      fetchStudentDetailsById(id)
        .then((res) => res.student)
        .then((res) =>
          getAllAssignmentsAPI(res.semester, res.section, res.department)
        )
        .then((res) => setAssignments(res.assignments))
        .catch((err) => console.log(err));
    }
  }, []);

  function handleDownloadAssignment(id) {
    console.log(id);
  }

  return (
    <Wrapper>
      <Heading>Assignment</Heading>
      <div className="relative overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-100">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                S.NO.
              </th>
              <th scope="col" className="px-6 py-3">
                Assign. Name
              </th>
              <th scope="col" className="px-6 py-3">
                Course
              </th>
              <th scope="col" className="px-6 py-3">
                Sem/Sec
              </th>
              <th scope="col" className="px-6 py-3">
                Download
              </th>
              <th scope="col" className="px-6 py-3">
                Submit
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-900 font-semibold">
            {assignments.map((res, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-500/60 even:bg-gray-400/60 border-bborder-gray-700 hover:bg-gray-900/70 transition hover:text-white"
              >
                <td className="px-4 py-2">{idx + 1}.</td>
                <td className="px-6 py-2">{res.assignmentName}</td>
                <td className="px-6 py-2 flex gap-1 items-center">
                  <span className="text-md">{res.subjectShortName}</span>
                  <span className="text-xs opacity-70 ">{res.subjectCode}</span>
                </td>
                <td className="px-6 py-2">
                  {res.semester}/{res.section}
                </td>
                <td className="px-6 py-2 w-10">
                  <span
                    onClick={() => handleDownloadAssignment(res._id)}
                    className="bg-sky-200 px-2 py-1 cursor-pointer text-black rounded-md hover:bg-sky-300 transition"
                  >
                    <DownloadIcon fontSize="small" />
                  </span>
                </td>
                {res.submittedBy.filter((stu) => stu.studentId === id)
                  .length === 0 ? (
                  <td className="px-6 py-2 w-10">
                    <span
                      onClick={() => setAssSelected(res._id)}
                      className="bg-sky-200 px-2 py-1 cursor-pointer text-black rounded-md hover:bg-sky-300 transition"
                    >
                      <SubmitIcon fontSize="small" />
                    </span>
                  </td>
                ) : (
                  <span className="px-4 text-sm text-teal-400">Submitted</span>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assSelected !== "" && (
        <UploadAssignmentBackdrop
          assignmentId={assSelected}
          setAssignmentId={setAssSelected}
          studentId={id}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {(errorMessage !== "" || successMessage !== "") && (
        <SuccErrSnackbar
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </Wrapper>
  );
}

function UploadAssignmentBackdrop({
  studentId,
  assignmentId,
  setAssignmentId,
  setErrorMessage,
  setSuccessMessage,
}) {
  const [file, setFile] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  function handleSubmitAssignment() {
    const formdata = new FormData();
    formdata.set("studentId", studentId);
    formdata.set("assignmentId", assignmentId);
    formdata.set("assignment", file);
    setApiCalled(true);
    uploadAssignmentAPI(formdata)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        //update the assignment array as soon as the assignment is uploaded
        setAssignmentId("");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setApiCalled(false));
  }
  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      if (e.target.files[0].size > 7340032) {
        alert("File is too large.");
        return;
      } else {
        setFile(e.target.files[0]);
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md overflow-auto">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setAssignmentId("");
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>
          <Heading>Upload Assignment</Heading>
          <div className="px-4 my-4 flex flex-col gap-5 ">
            <div>
              <label
                className="flex mb-2 font-medium text-gray-900 underline"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                onChange={handleFileChange}
                accept=".pdf"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
              />
            </div>
            <button
              disabled={apiCalled || !file}
              onClick={handleSubmitAssignment}
              className="bg-green-300 hover:bg-green-500/70 hover:text-white flex items-center justify-center uppercase rounded-md hover:ring-2 ring-green-600 transition disabled:cursor-not-allowed disabled:bg-gray-600/80 disabled:text-gray-200 py-1"
            >
              Submit
            </button>
          </div>
          <div className="px-4 italic text-sm grid">
            <span>* Only PDF formate supported.</span>
            <span>* File name should be URN_SubCode.pdf.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
