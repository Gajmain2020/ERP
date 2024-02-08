/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import {
  fetchAllCoursesBySemesterAPI,
  searchTimeTableAPI,
} from "../../../../api/admin";
import { useParams } from "react-router-dom";
import Loading from "../../Common/Loading";

const InitialSearchValue = {
  semester: "",
  section: "",
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const periods = [
  { number: "I", timeSlot: "10:00AM-10:50AM" },
  { number: "II", timeSlot: "10:50AM-11:40AM" },
  { number: "III", timeSlot: "11:40AM-12:30PM" },
  { number: "IV", timeSlot: "12:30PM-01:20PM" },
  { number: "V", timeSlot: "02:10PM-03:00PM" },
  { number: "VI", timeSlot: "03:00PM-03:50PM" },
  { number: "VII", timeSlot: "03:50PM-04:40PM" },
];

export default function AdminTimeTable() {
  const department = useParams().department;
  const [searchValue, setSearchValue] = useState(InitialSearchValue);
  const [apiCalled, setApiCalled] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeTable, setTimeTable] = useState(null);
  const [createNewTimeTable, setCreateNewTimeTable] = useState(false);

  function handleSearch() {
    if (searchValue.semester === "" || searchValue.section === "") {
      setErrorMessage(() => "Section and Semester must be specified.");
      return;
    }

    setApiCalled(() => true);
    searchTimeTableAPI(department, searchValue.semester, searchValue.section)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(() => res.message);
          return;
        }
        if (res.timeTable && res.timeTable !== null) {
          setTimeTable(res.timeTable);
          setSuccessMessage(
            () => "Time Table for the given section and semester alreddy exist."
          );
          return;
        }
        setErrorMessage(
          () => "Time Table for the given section and semester does not exist."
        );
      })
      .catch((err) => {
        setErrorMessage(() => err.message);
      })
      .finally(() => {
        setSearched(() => true);
        setApiCalled(() => false);
      });
  }

  function handleCreateNewTimeTable() {
    setCreateNewTimeTable(() => true);
  }

  return (
    <Wrapper>
      <Heading>Time Table</Heading>
      {!createNewTimeTable && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 ">
          <select
            required
            name="semester"
            className="bg-gray-200/30 rounded-md px-2 py-1 text-md col-span-2"
            id="semester"
            onChange={(e) =>
              setSearchValue((searchValue) => ({
                ...searchValue,
                semester: e.target.value,
              }))
            }
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
          <select
            required
            name="semester"
            className="bg-gray-200/30 rounded-md px-2 py-1 text-md col-span-2"
            id="semester"
            onChange={(e) =>
              setSearchValue((searchValue) => ({
                ...searchValue,
                section: e.target.value,
              }))
            }
          >
            <option selected value="">
              Select Section
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={apiCalled}
            className="border rounded-md flex gap-2 justify-center items-center bg-[#33b249]/70 py-1 hover:bg-[#33b249] transition duration-200 disabled:text-gray-700 disabled:bg-[#33b249]/50 disabled:cursor-not-allowed "
          >
            <span className="text-lg">
              {apiCalled ? "Searching ..." : "Search"}
            </span>
            <SearchTwoToneIcon fontSize="small" />
          </button>
        </div>
      )}

      {searched && !timeTable && (
        <CreateNewTimeTableComponent
          handleCreateNewTimeTable={handleCreateNewTimeTable}
          createNewTimeTable={createNewTimeTable}
          searchValue={searchValue}
          department={department}
        />
      )}

      {/* UTILITIES */}
      {(errorMessage === "" || successMessage === "") && (
        <ErrSuccSnackbar
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </Wrapper>
  );
}

function CreateNewTimeTableComponent({
  handleCreateNewTimeTable,
  createNewTimeTable,
  searchValue,
  department,
}) {
  const [timeTable, setTimeTable] = useState([
    ...Array.from({ length: 5 }, () =>
      Array.from({ length: 7 }, () => ({
        subjectShortName: ``,
        teacherName: ``,
      }))
    ),
    Array.from({ length: 5 }, () => ({
      subjectShortName: ``,
      teacherName: ``,
    })),
  ]);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    fetchAllCoursesBySemesterAPI(searchValue.semester, department)
      .then((res) => {
        if (!res.success) {
          alert(res.message);
          return;
        }
        setCourses(() => res.courses);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {});
  }, []);

  return (
    <>
      {!createNewTimeTable && (
        <div>
          No time table for the given section found.{" "}
          <span
            onClick={handleCreateNewTimeTable}
            className="font-semibold underline cursor-pointer hover:text-blue-400 transition"
          >
            Click here
          </span>{" "}
          to create new time table now.
        </div>
      )}
      {createNewTimeTable && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 lg:gap-3 md:gap-3 gap-1 items-center justify-around">
            <div className="bg-gray-300/70 flex justify-center w-full px-2 py-2 rounded-md font-semibold">
              Semester: {searchValue.semester}
            </div>
            <div className="bg-gray-300/70 flex justify-center w-full px-2 py-2 rounded-md font-semibold">
              Section: {searchValue.section}
            </div>
            <div className="bg-gray-300/70 flex justify-center w-full px-2 py-2 rounded-md font-semibold">
              Department: {department}
            </div>
          </div>

          <div className="hidden lg:flex md:flex">
            <div className="w-full">
              {!courses && <Loading />}
              {courses && (
                <table className="w-full border border-gray-400">
                  <thead className="rounded-md bg-gray-400/30">
                    <tr>
                      <th className="border border-gray-400"></th>
                      {periods.map((period, index) => (
                        <th
                          key={index}
                          className="border border-gray-400 px-2 py-2"
                        >
                          <span className="grid">
                            <span>{period.number}</span>
                            <span className="text-xs">{period.timeSlot}</span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day, idx) => (
                      <tr key={idx}>
                        <td className="border bg-gray-400/30 font-semibold border-gray-400 px-4 py-2">
                          {day}
                        </td>
                        {timeTable[idx].map((period, index) => (
                          <td
                            className="border text-center border-gray-400 px-4 py-1"
                            key={index}
                          >
                            <div className="grid">
                              <span>
                                {period.subjectShortName === ""
                                  ? "hello1"
                                  : "hello2"}
                              </span>
                              <span className="text-sm">
                                {period.teacherName === "" ? (
                                  <button onClick={() => {}}>say hello</button>
                                ) : (
                                  "hello2"
                                )}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr></tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* DO NOT DISPLAY TABLE IN SMALL DEVICES  */}
          <div className="flex lg:hidden md:hidden">
            <div className="flex justify-center items-center h-full w-full ">
              <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                <p className="text-gray-700 mb-4">
                  This task or feature cannot be accessed on small screen
                  devices. Please login with a computer or tablet to access this
                  feature.
                </p>
                <p className="text-gray-700 mb-4">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
