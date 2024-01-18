import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Heading from "../Common/Heading";
import Wrapper from "../Common/Wrapper";

import VisibilityIcon from "@mui/icons-material/Visibility";
import Fill from "@mui/icons-material/DriveFileRenameOutline";

// eslint-disable-next-line react/prop-types
export default function StudentHomepage({ token }) {
  const navigate = useNavigate();
  const id = location.pathname.split("/")[3];

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);

  //! useEffect for getting teacher data from the token
  useEffect(() => {
    if (token) {
      setData(() => jwtDecode(token)._doc);
    }
    console.log(data);
  }, [token]);

  //! useEffect for time display and updation of it in every second
  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  //# till teacher data is not decoded show skeleton and wait for data to be decoded
  if (data === null) {
    return (
      <Wrapper>
        <div role="status" className="center animate-pulse">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[640px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[540px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[640px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[540px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 mx-auto bg-gray-900 rounded-full dark:bg-gray-900 max-w-[640px]"></div>
          <div className="flex items-center justify-center mt-4">
            <svg
              className="w-8 h-8 text-gray-200 dark:text-gray-900 me-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-900 me-3"></div>
            <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-900"></div>
          </div>

          <div className="flex justify-center mt-5 text-2xl font-main mx-auto">
            <span>Loading...</span>
          </div>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Heading>Welcome Student</Heading>
      {/* TIME COMPONENT */}
      <div className="flex justify-end items-center ">
        <span className="border truncate flex gap-3 px-4 justify-center py-1 bg-gray-300/20 items-center w-[15vw] text-zinc-200 rounded-lg font-sub">
          <span>{date.toLocaleDateString()}</span>
          <span>{date.toLocaleTimeString()}</span>
        </span>
      </div>

      {/* Notice Component */}
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
          <span className="my-auto">Latest Notice And Announcements</span>
          <buton
            onClick={() => navigate("notice", { relative: "path" })}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="bg-neutral-300 px-3 py-1 rounded-md font-sub font-light hover:bg-neutral-700 hover:text-neutral-200 active: transition-all cursor-pointer active:outline active:scale-[95%] outline-offset-1"
          >
            View All
          </buton>
        </div>
        <div className="bg-zinc-200/20 px-2 min-h-[15vh] py-2 ">
          Make Api call to get new notice and announcements
        </div>
      </div>

      {/* Details component */}
      <div className="flex flex-col gap-2">
        <span className="mx-auto xl:text-2xl lg:text-2xl font-heading font-semibold text-zinc-900">
          Details
        </span>
        <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 sm:grid-cols-1 bg-zinc-200/50 p-3 rounded-md text-lg">
          <div className="flex gap-2 ">
            <span className="font-semibold">Name:</span> {data.name}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Department:</span>{" "}
            {data.department}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">CRN:</span> {data.crn}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">URN:</span> {data.urn}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Semester:</span> {data.semester}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Section:</span> {data.section}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">TG:</span> {data.TG.split("-")[0]}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Verified:</span>{" "}
            {data.verified ? "Verified" : "Not Verified"}
          </div>
          <div></div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Details Filled:</span>{" "}
            {data.detailsFilled ? (
              <div
                onClick={() => alert("create a data showing  component")}
                className="flex justify-center gap-2 items-center cursor-pointer"
              >
                Filled
                <button>
                  <VisibilityIcon fontSize="small" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => alert("create a data filling component")}
                className="flex justify-center gap-2 items-center cursor-pointer"
              >
                Not Filled
                <button>
                  <Fill fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <buton
            onClick={() => navigate("profile", { relative: "path" })}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="bg-neutral-300 px-3 py-1 rounded-md font-sub font-light hover:bg-neutral-700 hover:text-neutral-200 active: transition-all cursor-pointer active:outline active:scale-[95%] outline-offset-1"
          >
            Edit Profile
          </buton>
        </div>
      </div>
    </Wrapper>
  );
}
