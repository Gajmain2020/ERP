/* eslint-disable react/prop-types */
import Wrapper from "../../Common/Wrapper";
import Heading from "../../Common/Heading";
import { Link } from "react-router-dom";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

//make api call to fetch all the assignment uploaded by respective teacher
const dummyAssigments = [
  {
    assignmentName: "Test1",
    subjectCode: "101",
    subjectShortName: "DSA",
    semester: "III",
    section: "B",
  },
  {
    assignmentName: "Test2",
    subjectCode: "102",
    subjectShortName: "OS",
    semester: "III",
    section: "A",
  },
  {
    assignmentName: "Test3",
    subjectCode: "101",
    subjectShortName: "DSA",
    semester: "III",
    section: "B",
  },
];

const initialAssignmentData = {
  assignmentName: "",
  subjectCode: "",
  subjectShortName: "",
  semester: "",
  section: "",
};

function Assignment() {
  const [openAddAssignmentBackdrop, setOpenAddAssignmentBackdrop] =
    useState(false);
  const [newAssignementData, setNewAssignementData] = useState(
    initialAssignmentData
  );
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleAddNewAssignment() {
    if (
      newAssignementData === null ||
      newAssignementData.assignmentName === "" ||
      newAssignementData.subjectCode === "" ||
      newAssignementData.subjectShortName === "" ||
      newAssignementData.semester === "" ||
      newAssignementData.section === ""
    ) {
      setErrorMessage("All fields are required to publish new assignment.");
      return;
    } else if (file === null) {
      setErrorMessage("File is required to publish new assignment.");
      return;
    }

    //! make api call to store that assignment data from frontend to backend and gather response
    console.log("file::", file);
    console.log("new Assignment data::", newAssignementData);
  }
  return (
    <Wrapper>
      <ErrSuccSnackbar
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        setSuccessMessage={setSuccessMessage}
        successMessage={successMessage}
      />
      <Heading>Assignments</Heading>

      {/* upload button and its message */}
      <div className="flex justify-center flex-col gap-2">
        <span className="text-gray-960 font-semibold font-sans">
          Want to add new assignment!! Please click the below button::
        </span>
        <button
          className="px-10 py-3 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all hover:outline outline-fuchsia-500/30 active:ouline-fuchsia-900 active:bg-zinc-900 text-lg font-semibold rounded-md text-gray-100"
          onClick={() => setOpenAddAssignmentBackdrop(true)}
        >
          Add Assignment
        </button>
      </div>
      {openAddAssignmentBackdrop && (
        <BackdropComponent
          open={openAddAssignmentBackdrop}
          setOpen={setOpenAddAssignmentBackdrop}
          setNewAssignment={setNewAssignementData}
          handleAddNewAssignment={handleAddNewAssignment}
          setFile={setFile}
        />
      )}

      {/* PREVIOUSLY UPLOADED ASSIGNMENTS */}
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
          <span className="my-auto">Previously Uploaded Assignments</span>
          {/* SHOW THIS BUTTON IF THE MAIN COMPONENT CAN NOT ACCOMODATE ALL THE DATA */}
          {/* <buton
            data-te-ripple-init
            data-te-ripple-color="light"
            className="bg-neutral-300 px-3 py-1 rounded-md font-sub font-light hover:bg-neutral-700 hover:text-neutral-200 active: transition-all cursor-pointer active:outline active:scale-[95%] outline-offset-1"
          >
            View All
          </buton> */}
        </div>
        <div className="bg-zinc-200/20 px-2 min-h-[15vh] py-2 ">
          <div className="flex flex-col rounded-md overflow-hidden">
            <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
              <span className="my-auto underline underline-offset-2 font-semibold">
                View Submission
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
                      Assignment Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Semester / Section
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/6">
                      View Submission
                    </th>
                  </tr>
                </thead>
                <tbody className="dark:text-zinc-200">
                  {dummyAssigments.map((ass, idx) => (
                    <TableRow
                      key={idx}
                      ind={idx}
                      assignmentName={ass.assignmentName}
                      semester={ass.semester}
                      section={ass.section}
                      subjectShortName={ass.subjectShortName}
                      subjectCode={ass.subjectCode}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

function TableRow({
  ind,
  semester,
  section,
  subjectCode,
  subjectShortName,
  assignmentName,
}) {
  return (
    <>
      <tr className="odd:dark:bg-zinc-700/60 even:bg-zinc-100 even:dark:bg-zinc-800 border-b dark:border-zinc-700 px-0 py-0 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/80">
        <td className="px-6 py-2 font-semibold">{ind + 1}.</td>
        <th
          scope="row"
          className="px-6 py-2 font-medium text-zinc-900 whitespace-nowrap dark:text-white text-md"
        >
          {assignmentName}
        </th>
        <td className="px-6 py-2">{subjectCode + " / " + subjectShortName}</td>
        <td className="px-6 py-2">{semester + " / " + section}</td>
        <td className="px-6 py-2">
          <Link to={assignmentName + "-" + subjectCode + "-" + semester}>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-zinc-400/70 text-zinc-950 font-medium hover:bg-zinc-400/90 transition-all active:ouline active:bg-zinc-500"
            >
              View
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
}

function BackdropComponent({
  setOpen,
  setNewAssignment,
  handleAddNewAssignment,
  setFile,
}) {
  const handleChange = (e) => {
    setNewAssignment((assign) => ({
      ...assign,
      [e.target.name]: e.target.value,
    }));
  };

  function handleFileUpload(e) {
    if (e.target.files[0] !== null) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 lg:h-2/3 md:h-2/3 lg:w-1/2 md:1/2 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpen(false);
                setFile(null);
                setNewAssignment(initialAssignmentData);
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>

          <Heading>New Assignment</Heading>

          {/* MAIN FORM FOR INPUT */}
          <div className="px-2 mt-3 grid gap-3  lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <label
                htmlFor="assignmentName"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Assignment Name
              </label>
              <input
                name="assignmentName"
                type="text"
                id="assignmentName"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold"
                placeholder="Maths Assigment 1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subjectCode"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Subject Code
              </label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                placeholder="102301CS"
                required
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label
                htmlFor="subjectShortName"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Subject Short Name
              </label>
              <input
                type="text"
                id="subjectShortName"
                name="subjectShortName"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold"
                placeholder="M3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="Semester"
                className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Semester
              </label>
              <select
                required
                name="semester"
                id="semester"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="">
                  Select Semester
                </option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="section"
                className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Section
              </label>
              <select
                name="section"
                id="section"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="">
                  Select Section
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div>
              <label
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file"
              >
                Upload file
              </label>
              <input
                accept=".pdf"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                cursor-pointer focus:outline-none"
                id="file"
                name="file"
                type="file"
                hidden
                onChange={handleFileUpload}
              ></input>
            </div>
          </div>
          <div className="flex justify-center lg:my-10 md:my-10 sm:my-5  xs:my-5">
            <button
              onClick={handleAddNewAssignment}
              className="border bg-gray-700/70 hover: text-gray-100 px-8 py-1 font-semibold rounded-md "
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assignment;
