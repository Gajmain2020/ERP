import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import {
  addAttendanceAPI,
  downloadAttendanceCSVAPI,
  fetchClassesAPI,
} from "../../../../api/teacher";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import { Button } from "@mui/material";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import Papa from "papaparse";

const Day_Options = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Attendence() {
  const teacherId = useParams().id;

  const [apiCalled, setApiCalled] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [students, setStudents] = useState(null);
  const [cls, setCls] = useState(null);

  const [presentStudents, setPresentStudents] = useState([]);

  const [searchData, setSearchData] = useState({
    courseShortName: "",
    semester: "",
    section: "",
    day: -1,
    period: -1,
    date: "",
  });

  function handleChange(e) {
    if (e.target.name === "period") {
      setSearchData((searchData) => ({
        ...searchData,
        period: parseInt(e.target.value),
      }));
      return;
    }
    if (e.target.name === "date") {
      setSearchData((searchData) => ({
        ...searchData,
        day: new Date(e.target.value).getDay(),
        date: e.target.value,
      }));
      return;
    }

    setSearchData((searchData) => ({
      ...searchData,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSearch() {
    if (
      searchData.semester === "" ||
      searchData.section === "" ||
      searchData.day === -1 ||
      searchData.period === -1
    ) {
      setErrorMessage("*All Fields Are Required");
      return;
    }

    fetchClassesAPI(teacherId, searchData)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setStudents(res.students);
        setCls(res.cls);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(false));
  }

  function handleResetClick() {
    setStudents(null);
    setCls(null);
    setSearchData({
      courseShortName: "",
      semester: "",
      section: "",
      day: -1,
      period: -1,
    });
  }

  function handlePresentStudent(e, student) {
    if (e.target.checked) {
      setPresentStudents((students) => [...students, student._id]);
      return;
    }
    setPresentStudents((students) =>
      students.filter((stu) => stu.studentId !== student._id)
    );
    return;
  }

  function handleAddAttendance() {
    const allStudents = students.map((stu) => {
      if (presentStudents.includes(stu._id)) {
        return { studentId: stu._id, present: true };
      }
      return { studentId: stu._id, present: false };
    });

    setApiCalled(true);
    addAttendanceAPI(teacherId, allStudents, searchData)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        console.log(res);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setApiCalled(false));
  }

  function handleDownloadCSV() {
    if (
      searchData.courseShortName === "" ||
      searchData.semester === "" ||
      searchData.section === ""
    ) {
      setErrorMessage("Course Short Name, semester and Section are required.");
      return;
    }
    setApiCalled(true);
    downloadAttendanceCSVAPI(teacherId, searchData)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }

        const students = res.students.map((student) => ({
          Name: student.name,
          CRN: student.crn,
          URN: student.urn,
        }));

        const csvData = jsonToCsv(students);
        downloadFile(
          csvData,
          `Attendance_${searchData.semester}_${searchData.section}.csv`
        );
        setSuccessMessage("Downloading CSV file.");
        handleResetClick();
        return;
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setApiCalled(false));
  }

  function jsonToCsv(jsonData) {
    const dates = generateDates();

    const csvData = Papa.unparse({
      fields: ["Name", "CRN", "URN", ...dates],
      data: jsonData,
    });
    return csvData;
  }

  const generateDates = () => {
    const currentDate = new Date();
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const datesArray = [];
    for (let i = 1; i <= lastDay; i++) {
      datesArray.push(
        `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`
      );
    }
    return datesArray;
  };

  function downloadFile(csvData, filename) {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }

  function handleUploadCSV() {
    console.log("handle upload csv for attendance");
  }

  return (
    <Wrapper>
      <Heading>Add Attendence</Heading>

      {/* classes table component */}
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="bg-zinc-200/20 min-h-[50vh] py-2 px-1 flex flex-col gap-1 overflow-auto">
          {!cls && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2 gap-2">
                <div className="w-full">
                  <label
                    htmlFor="courseShortName"
                    className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Course Short Name
                  </label>
                  <input
                    type="text"
                    className={INPUT_STYLE}
                    name="courseShortName"
                    id="courseShortName"
                    placeholder="Course Short Name"
                    value={searchData.courseShortName}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
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
                    value={searchData.semester}
                    className={INPUT_STYLE}
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
                <div className="w-full">
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
                    value={searchData.section}
                    className={INPUT_STYLE}
                  >
                    <option selected value="">
                      Select Section
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="DS">DS</option>
                    <option value="AI">AI</option>
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="date"
                    className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    onChange={handleChange}
                    className={INPUT_STYLE}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="period"
                    className="block mb-1 mx-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Period
                  </label>
                  <select
                    required
                    name="period"
                    id="period"
                    onChange={handleChange}
                    value={searchData.period}
                    className={INPUT_STYLE}
                  >
                    <option selected value="">
                      Select Period
                    </option>
                    <option value="0">1</option>
                    <option value="1">2</option>
                    <option value="2">3</option>
                    <option value="3">4</option>
                    <option value="4">5</option>
                    <option value="5">6</option>
                    <option value="6">7</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-1 gap-3">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={handleDownloadCSV}
                >
                  Download CSV
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="info"
                  onClick={handleUploadCSV}
                >
                  Upload CSV For Month
                </Button>
              </div>
              <div className="text-sm italic">
                <div className="font-semibold underline">Notes</div>
                <div>
                  * To download CSV file only semester and section is required.
                </div>
                <div>* To download CSV file course code is required.</div>
              </div>
            </>
          )}
          {cls && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 font-semibold text-md bg-gray-200/50 rounded-md py-1">
              <div className="flex justify-center items-center">
                <span>Course Short Name:</span>&nbsp; {cls.courseShortName}
              </div>
              <div className="flex justify-center items-center">
                <span>Day:</span>&nbsp; {Day_Options[cls.dayOfWeek]}
              </div>
              <div className="flex justify-center items-center">
                <span>Sem/Sec:</span>&nbsp; {cls.semester}/{cls.section}
              </div>
              <div className="flex justify-center items-center">
                <span>Period:</span>&nbsp; {cls.period + 1}
              </div>
              <div className="flex justify-center items-center gap-2">
                <Button
                  onClick={handleResetClick}
                  variant="contained"
                  color="warning"
                  size="small"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleAddAttendance}
                  variant="contained"
                  color="success"
                  size="small"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          {/* main component to show list of students */}
          {cls && students && students.length === 0 && (
            <div className="flex justify-center items-center text-lg text-red-900 font-semibold">
              No Students Found to display. Please reset and try again
            </div>
          )}
          {cls && students && students.length !== 0 && (
            <div>
              <div className="relative rounded-lg overflow-x-auto">
                <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-4 hidden md:block lg:block"
                      >
                        S.No.
                      </th>
                      <th scope="col" className="px-3 py-4">
                        CRN
                      </th>
                      <th scope="col" className="px-3 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-4 hidden lg:block">
                        URN
                      </th>
                      <th scope="col" className="px-3 py-4">
                        Present
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students &&
                      students.length > 0 &&
                      students.map((student, idx) => (
                        <tr
                          key={student._id}
                          className="bg-gray-500/80 hover:bg-gray-700/70 transition duration-200 border-b dark:border-gray-700 dark:text-gray-200"
                        >
                          <th
                            scope="row"
                            className="px-6 py-2 whitespace-nowrap hidden md:block lg:block"
                          >
                            {idx + 1}
                          </th>
                          <td className="px-6 xs:px-2 font-medium py-2 text-white">
                            {student.crn}
                          </td>
                          <td className="px-6 py-2">{student.name}</td>
                          <td className="px-6 py-2 hidden lg:block">
                            {student.urn}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              onChange={(e) => handlePresentStudent(e, student)}
                              type="checkbox"
                              className="w-4 h-4 p-0 m-0 accent-green-500"
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* //! utility for error and success Snackbar */}
      {(errorMessage !== "" || successMessage !== "") && (
        <ErrSuccSnackbar
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </Wrapper>
  );
}

export default Attendence;
