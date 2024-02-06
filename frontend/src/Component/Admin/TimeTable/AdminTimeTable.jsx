import { useState } from "react";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";

const InitialSearchValue = {
  semester: "",
  section: "",
};

export default function AdminTimeTable() {
  const [searchValue, setSearchValue] = useState(InitialSearchValue);

  return (
    <Wrapper>
      <Heading>Time Table</Heading>
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
              semester: e.target.value,
            }))
          }
        >
          <option selected value="">
            Select Section
          </option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <button className="border rounded-md flex gap-2 justify-center items-center bg-[#33b249]/70 py-1 hover:bg-[#33b249] transition duration-200">
          <span className="text-lg">Search</span>
          <SearchTwoToneIcon fontSize="small" />
        </button>
      </div>
    </Wrapper>
  );
}
