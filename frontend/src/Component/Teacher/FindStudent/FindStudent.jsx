import { useState } from "react";

import Wrapper from "../../Common/Wrapper";
import ErrSuccSnackbar from "../../Common/ErrSuccSnackbar";
import Heading from "../../Common/Heading";

import SearchIcon from "@mui/icons-material/Search";

const inputStyles =
  "bg-transparent border rounded-md px-3 text-gray-200 py-1 text-lg flex-1";

export default function FindStudent() {
  const [errorMessage, setErrorMessage] = useState("");
  const [searchField, setSearchField] = useState("");

  function handleKeyDown(e) {
    if (e.keyCode === 13) handleSearch();
  }

  function handleSearch() {
    console.log("handle search called", searchField);
  }

  return (
    <Wrapper>
      <Heading>Find Student</Heading>

      <div className="flex items-center gap-5 justify-center ">
        <input
          placeholder="URN Or Name"
          onKeyDown={handleKeyDown}
          className={inputStyles}
          type="text"
          onChange={(e) => setSearchField(() => e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="border rounded-md py-1 px-3 bg-blue-500/80 hover:text-white hover:bg-blue-600/80 transition"
        >
          <SearchIcon />
          <span className="my-auto text-lg font-semibold">Search</span>
        </button>
      </div>
    </Wrapper>
  );
}
