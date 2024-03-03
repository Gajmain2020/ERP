import { useEffect, useState } from "react";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import { INPUT_STYLE } from "../../../Constants/Students.constants";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {}, []);

  // if (!attendanceData) {
  //   return (
  //     <Wrapper>
  //       <Heading>Attendance</Heading>
  //       <div className="flex text-2xl font-semibold font-sub h-full items-center justify-center animate-bounce ">
  //         <span className="animate-pulse">Loading...</span>
  //       </div>
  //     </Wrapper>
  //   );
  // }
  return (
    <Wrapper>
      <Heading>Attendance</Heading>

      <div className="flex justify-between w-full">
        <div className="mx-2">
          <select name="filter" id="" className={INPUT_STYLE}>
            <option value="">Session</option>
            {/* //! give options here */}
          </select>
        </div>
        <div className="flex-1">
          <input type="text" className={INPUT_STYLE} placeholder="🔍 Search" />
        </div>
        <div className="mx-2 h-full flex items-center justify-center mt-1">
          <button className=" px-3 py-1 rounded-md w-20 mx-auto bg-green-200/80 hover:bg-green-500/60 hover:text-white transition shadow-md">
            Search
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
