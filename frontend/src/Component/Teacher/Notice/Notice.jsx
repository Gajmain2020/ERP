/* eslint-disable react/prop-types */
import Wrapper from "../../Common/Wrapper";
import Heading from "../../Common/Heading";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

//make api call to fetch all the assignment uploaded by respective teacher
const dummyNotice = [
  {
    noticeNumber: "Test1",
    noticeSubject: "DSA",
    semester: "III",
    section: "A",
    date: "2021-22",
  },
  {
    noticeNumber: "Test2",
    noticeSubject: "DSA",
    semester: "III",
    section: "A",
    date: "2021-22",
  },
  {
    noticeNumber: "Test3",
    noticeSubject: "DSA",
    semester: "III",
    section: "A",
    date: "2021-22",
  },
];

const initialNoticeData = {
  noticeNumber: "",
  noticeSubject: "",
  semester: "",
  section: "",
};

function Notice() {
  const [openAddNewNoticeBackdrop, setOpenAddNewNoticeBackdrop] =
    useState(false);
  const [newNoticeData, setNewNoticeData] = useState(initialNoticeData);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleAddNewNotice() {
    if (
      newNoticeData === null ||
      newNoticeData.noticeNumber === "" ||
      newNoticeData.noticeSubject === "" ||
      newNoticeData.semester === "" ||
      newNoticeData.section === ""
    ) {
      setErrorMessage("All fields are required to publish new question paper.");
      return;
    } else if (file === null || !file) {
      setErrorMessage("File is required to publish new question paper.");
      return;
    }

    //!! make api call to store previous year question paper in the database
    console.log("file::", file);
    newNoticeData.date = new Date();
    console.log("new Assignment data::", newNoticeData);

    //! create form data and send all data to backend!!!!
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("data", newNoticeData);

    //* send above form data to backend
  }

  function downloadNotice(noticeNumber) {
    //!! make api call to download previous question paper
    console.log("download the paper which is neede");
    console.log(noticeNumber);
  }

  return (
    <Wrapper>
      <ErrSuccSnackbar
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        setSuccessMessage={setSuccessMessage}
        successMessage={successMessage}
      />
      <Heading>Notice</Heading>

      {/* upload button and its message */}
      <div className="flex justify-center flex-col gap-2">
        <span className="text-gray-960 font-semibold font-sans">
          Want to add new notice!! Please click the below button ::
        </span>
        <button
          className="px-10 py-3 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all hover:outline outline-fuchsia-500/30 active:ouline-fuchsia-900 active:bg-zinc-900 text-lg font-semibold rounded-md text-gray-100"
          onClick={() => setOpenAddNewNoticeBackdrop(true)}
        >
          Add New Notice
        </button>
      </div>
      {openAddNewNoticeBackdrop && (
        <BackdropComponent
          open={openAddNewNoticeBackdrop}
          setOpen={setOpenAddNewNoticeBackdrop}
          setNewNoticeData={setNewNoticeData}
          handleAddNewNotice={handleAddNewNotice}
          setFile={setFile}
        />
      )}

      {/* PREVIOUSLY UPLOADED  */}
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
          <span className="my-auto">Previously Uploaded Notice</span>
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
                View Notices
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
                      Notice Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Notice Subject
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Semester / Section
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/6">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="dark:text-zinc-200">
                  {dummyNotice.map((notice, idx) => (
                    <TableRow
                      key={idx}
                      downloadNotice={downloadNotice}
                      ind={idx}
                      noticeNumber={notice.noticeNumber}
                      semester={notice.semester}
                      section={notice.section}
                      noticeSubject={notice.noticeSubject}
                      date={notice.date}
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
  noticeSubject,
  date,
  noticeNumber,
  downloadNotice,
}) {
  return (
    <>
      <tr
        className="odd:dark:bg-zinc-700/60 even:bg-zinc-100 cursor-pointer even:dark:bg-zinc-800 border-b dark:border-zinc-700 px-0 py-0 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/80"
        onClick={() => downloadNotice(noticeNumber)}
      >
        <td className="px-6 py-2 font-semibold">{ind + 1}.</td>
        <th
          scope="row"
          className="px-6 py-2 font-medium text-zinc-900 whitespace-nowrap dark:text-white text-md"
        >
          {noticeNumber}
        </th>
        <td className="px-6 py-2">{noticeSubject}</td>
        <td className="px-6 py-2">
          {semester} / {section}
        </td>
        <td className="px-6 py-2">{date}</td>
      </tr>
    </>
  );
}

function BackdropComponent({
  setOpen,
  setNewNoticeData,
  handleAddNewNotice,
  setFile,
}) {
  const handleChange = (e) => {
    setNewNoticeData((notice) => ({
      ...notice,
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
                setNewNoticeData(initialNoticeData);
                setFile(null);
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>

          <Heading>New Notice</Heading>

          {/* MAIN FORM FOR INPUT */}
          <div className="px-2 mt-3 grid gap-3  lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
            <div>
              <label
                htmlFor="noticeNumber"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Notice Number
              </label>
              <input
                type="text"
                id="noticeNumber"
                name="noticeNumber"
                placeholder="DM101"
                required
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label
                htmlFor="noticeSubject"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Notice Subject
              </label>
              <input
                type="text"
                id="noticeSubject"
                name="noticeSubject"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold"
                placeholder="Subject of the notice"
                required
              />
            </div>

            <div>
              <label
                htmlFor="semester"
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
                required
                name="section"
                id="section"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="">
                  Select Semester
                </option>
                <option value="I">A</option>
                <option value="II">B</option>
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
              onClick={handleAddNewNotice}
              className="border bg-gray-700/70 hover: text-gray-100 px-8 py-1 font-semibold rounded-md "
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notice;
