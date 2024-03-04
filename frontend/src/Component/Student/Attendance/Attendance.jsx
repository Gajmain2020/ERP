import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import { fetchStudentAttendanceAPI } from "../../../../api/student";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";

export default function Attendance() {
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    //* make API call to fetch attendance of the student
    if (!attendanceData) {
      fetchStudentAttendanceAPI(id)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setAttendanceData(res.attendance);
          formateData(res.attendance);
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
  }, []);

  function formateData(data) {
    setMonthOptions(data.map((d) => d.month));
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

  return (
    <Wrapper>
      <Heading>Attendance</Heading>

      <div className="flex justify-between w-full">
        <div className="mx-2">
          <select
            placeholder="hello"
            name="filter"
            id=""
            className={INPUT_STYLE}
          >
            <option selected value="">
              Select Month
            </option>
            <option selected value="">
              All
            </option>

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
