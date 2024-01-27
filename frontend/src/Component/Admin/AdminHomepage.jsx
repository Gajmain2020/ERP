import { useEffect, useState } from "react";

import Wrapper from "../Common/Wrapper";
import Heading from "../Common/Heading";
import { useNavigate } from "react-router-dom";
import { QuickLinkStyles } from "../../Constants/Admin.constants";

export default function AdminHomepage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  //! useEffect for time display and updation of it in every second
  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);
  return (
    <Wrapper>
      <Heading>Welcome Admin</Heading>
      {/* Time compoent */}
      <div className="flex justify-end items-center">
        <span className="border truncate flex gap-3 px-4 py-1 bg-gray-300/40 text-zinc-200 rounded-lg font-sub">
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
          Make Api call to get new notice and announcements.
        </div>
      </div>

      <div className="w-full px-2 py-2">
        <div className="bg-gray-200/20 text-xl rounded-md px-1 flex justify-center items-center">
          Quick Links
        </div>
        <div className="grid lg:gap-3 md:gap-3 sm:gap-0 xs:gap-0 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <button
            className={QuickLinkStyles}
            onClick={() => navigate("students")}
          >
            Add Student
          </button>
          <button
            className={QuickLinkStyles}
            onClick={() => navigate("teachers")}
          >
            Add Teacher
          </button>
          <button
            className={QuickLinkStyles}
            onClick={() => navigate("notice")}
          >
            Add Notice
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
