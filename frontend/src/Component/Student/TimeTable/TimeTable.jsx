import { useParams } from "react-router-dom";
import Wrapper from "../../Common/Wrapper";
import { useEffect, useState } from "react";
import Heading from "../../Common/Heading";
import {
  fetchStudentDetailsById,
  getTimeTableAPI,
} from "../../../../api/student";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const periods = [
  { number: "I", timeSlot: "10:00AM-10:50AM" },
  { number: "II", timeSlot: "10:50AM-11:40AM" },
  { number: "III", timeSlot: "11:40AM-12:30PM" },
  { number: "IV", timeSlot: "12:30PM-01:20PM" },
  { number: "V", timeSlot: "02:10PM-03:00PM" },
  { number: "VI", timeSlot: "03:00PM-03:50PM" },
  { number: "VII", timeSlot: "03:50PM-04:40PM" },
];

export default function TimeTable() {
  const { id } = useParams();
  const [timeTable, setTimeTable] = useState(null);

  useEffect(() => {
    if (!timeTable) {
      fetchStudentDetailsById(id)
        .then((res) => res.student)
        .then((res) =>
          getTimeTableAPI(res.semester, res.section, res.department)
        )
        .then((res) => setTimeTable(res.timeTable.timeTable))
        .catch((err) => console.log(err));
    }
  }, []);
  console.log("this is timetable ::", timeTable);

  return (
    <Wrapper>
      <Heading>Time Table</Heading>
      <div className="flex justify-center font-semibold text-lg items-center">
        Time Table for semester and section
      </div>
      <div>
        <table className="w-full border bg-gray-200/80 border-gray-400">
          <thead className="rounded-md bg-gray-700/30">
            <tr>
              <th className="border border-gray-700"></th>
              {periods.map((period, index) => (
                <th key={index} className="border border-gray-700 px-2 py-2">
                  <span className="grid">
                    <span>{period.number}</span>
                    <span className="text-xs">{period.timeSlot}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeTable &&
              days.map((day, idx) => (
                <tr key={idx}>
                  <td className="border bg-gray-700/30 font-semibold border-gray-700 px-4 py-2">
                    {day}
                  </td>
                  {timeTable[idx].map((period, index) => (
                    <td
                      className="border text-center border-gray-400"
                      key={index}
                    >
                      <div className="grid gap-0.5 py-1 px-1 text-sm">
                        <span className="font-semibold">
                          {period.courseShortName}
                        </span>
                        <span className="p-0 ">{period.teacherName}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="italic text-black font-semibold">
        * Lunch timings are from 01:20PM to 02:10PM.
      </div>
    </Wrapper>
  );
}
