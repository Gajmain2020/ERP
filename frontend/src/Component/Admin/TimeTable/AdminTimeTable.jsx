import { useState } from "react";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import { searchTimeTableAPI } from "../../../../api/admin";
import { useParams } from "react-router-dom";

const InitialSearchValue = {
  semester: "",
  section: "",
};

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
          <div className="flex gap-3 items-center justify-around">
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
        </>
      )}
    </>
  );
}
