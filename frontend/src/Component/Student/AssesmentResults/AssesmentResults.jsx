import { Link } from "react-router-dom";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import { INPUT_STYLE } from "../../../Constants/Students.constants";
import { useEffect, useState } from "react";

const dummyResult = [
  {
    examName: "CT2",
    semester: "III",
  },
  {
    examName: "CT1",
    semester: "III",
  },
  {
    examName: "CT2",
    semester: "II",
  },
  {
    examName: "CT1",
    semester: "II",
  },
];

export default function AssesmentResults() {
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    setSemesters(["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]);
    setResults(dummyResult);
    setFilteredResults(dummyResult);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Wrapper>
        <div className="relative flex justify-center items-center ">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
          <img
            src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
            className="rounded-full h-28 w-28"
          />
        </div>
        <div className="flex items-center justify-center animate-pulse text-2xl font-main">
          Loading...
        </div>
      </Wrapper>
    );
  }

  function handleSemesterChange(e) {
    if (e.target.value === "") {
      setFilteredResults(...results);
      return;
    }
    setFilteredResults(
      results.filter((res) => res.semester === e.target.value)
    );
  }

  return (
    <Wrapper>
      <Heading>Internal Assesment Results</Heading>
      <div>
        <select onChange={handleSemesterChange} className={INPUT_STYLE}>
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>
      <div className="relative overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-100">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                S.NO.
              </th>
              <th scope="col" className="px-6 py-3">
                Exam Name
              </th>
              <th scope="col" className="px-6 py-3">
                Semester
              </th>
              <th scope="col" className="px-6 py-3">
                View
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-900 font-semibold">
            {!filteredResults.length ? (
              <tr aria-rowspan={10} className="w-full">
                No Results for show.
              </tr>
            ) : (
              filteredResults.map((res, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-gray-500/60 even:bg-gray-400/60 border-bborder-gray-700 hover:bg-gray-900/70 transition hover:text-white"
                >
                  <td className="px-4 py-3">{idx + 1}.</td>
                  <td className="px-6 py-3">{res.examName}</td>
                  <td className="px-6 py-3">{res.semester}</td>
                  <td className="px-6 py-3">
                    <Link to={`${res.examName + "_" + res.semester}`}>
                      <span className="bg-sky-200 px-3 py-1 text-black rounded-md hover:bg-sky-300 transition">
                        View
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}
