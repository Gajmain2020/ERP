import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import { fetchStudentAttendanceAPI } from "../../../../api/student";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import { AttendanceHeaderOption } from "../../../Constants/Teacher.constants";
import { format } from "date-fns";

export default function Attendance() {
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [monthOptions, setMonthOptions] = useState([]);
  const [attendanceToShow, setAttendanceToShow] = useState([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    //* make API call to fetch attendance of the student
    if (!attendanceData) {
      fetchStudentAttendanceAPI(id)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setMonthOptions(res.attendance.map((d) => d.month));
          setAttendanceData(() => res.attendance);
          formateData(res.attendance);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
  }, []);

  useEffect(() => {
    //! formate  data for students
    if (month === "" && attendanceData) {
      formateData(attendanceData);
      console.log("month not selected");
      return;
    }
    if (month !== "" && attendanceData) {
      returnFormateData(attendanceData, month);
      return;
    }
  }, [month]);

  function formateData(data) {
    setAttendanceToShow(
      data
        .flatMap((month) =>
          month.classes.flatMap((course) =>
            course.status.map((status) => ({
              month: month.month,
              courseShortName: course.courseShortName,
              period: status.period,
              date: status.date,
              takenBy: status.takenBy,
              present: status.present,
            }))
          )
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  }

  function returnFormateData(attendance, month) {
    if (attendance) {
      const newData = attendance
        .flatMap((month) =>
          month.classes.flatMap((course) =>
            course.status.map((status) => ({
              month: month.month,
              courseShortName: course.courseShortName,
              period: status.period,
              date: status.date,
              takenBy: status.takenBy,
              present: status.present,
            }))
          )
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setAttendanceToShow(newData.filter((d) => d.month === month));
    }
  }

  //! dummy screen while useeffect is running
  if (!attendanceData) {
    return (
      <Wrapper>
        <Heading>Attendance</Heading>
        <div className="flex text-2xl font-semibold font-sub h-full items-center justify-center animate-bounce ">
          <span className="animate-pulse">Loading...</span>
        </div>
      </Wrapper>
    );
  }

  function handleSheetDownload() {
    console.log("Handle sheet download triggered");
  }

  return (
    <Wrapper>
      <Heading>Attendance</Heading>

      {/*//* Search and filter field */}
      <div className="flex justify-between w-full">
        <div className="mx-2">
          <select
            placeholder="hello"
            name="filter"
            className={INPUT_STYLE}
            onClick={(e) => setMonth(e.target.value)}
          >
            <option selected value="">
              Select Month
            </option>
            <option value="">All</option>

            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
            {/* //! give options here */}
          </select>
        </div>
        <div className="flex-1">
          <input type="text" className={INPUT_STYLE} placeholder="🔍 Search" />
        </div>
        <div className="mx-2 h-full flex items-center justify-center mt-1">
          <button className=" px-3 py-1 rounded-md w-20 mx-auto bg-green-200/80 hover:bg-green-500/60 hover:text-white transition shadow-md font-heading font-semibold">
            Search
          </button>
        </div>
      </div>

      {/*//* download sheet button*/}
      <div className="flex justify-end mx-5">
        <button
          onClick={handleSheetDownload}
          className="px-2 font-sm font-semibold italic rounded-md border-2 bg-sky-500/40 text-white hover:bg-sky-500/80 transition flex gap-1 items-center"
        >
          <DownloadTwoToneIcon />
          Download
        </button>
      </div>

      {/*//* main table component button*/}
      <div className="relative rounded-lg overflow-x-auto">
        <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/80 dark:text-gray-200">
            <tr>
              {AttendanceHeaderOption.map((header) => (
                <th key={header} scope="col" className="px-3 py-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceToShow.map((att, idx) => (
              <tr
                key={idx}
                className="bg-gray-500/80 hover:bg-gray-700/70 transition duration-200 border-b dark:border-gray-700 dark:text-gray-200"
              >
                <th scope="row" className="px-4 py-2 w-32">
                  {format(new Date(att.date), "dd/MM/yyyy")}
                </th>
                <td className="px-4 font-medium py-2 text-white">
                  {att.courseShortName}
                </td>
                <td className="px-4 py-2">{att.period + 1}</td>
                <td className="px-4 py-2">{att.takenBy}</td>
                <td className="px-4 py-2 w-32">
                  {att.present ? (
                    <span className="font-semibold text-green-700 rounded bg-green-200/60 px-3 py-1">
                      Present
                    </span>
                  ) : (
                    <span className="font-semibold text-red-700 rounded bg-red-200/60 px-3 py-1">
                      Absent
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* //! utility for error and success snackbar */}
      {errorMessage !== "" && (
        <ErrSuccSnackbar
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </Wrapper>
  );
}
