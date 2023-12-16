/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useNavigate } from "react-router";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";
import AnchorButton from "../../Common/AnchorButton";
import { Link } from "react-router-dom";

function Classes({ token, setToken }) {
  // make api call to get table content this is for only demonstration
  const tableContent = [
    {
      semester: "III",
      section: "B",
      subject: "M3",
      numberOfStudents: "10",
    },
    {
      semester: "III",
      section: "A",
      subject: "M3",
      numberOfStudents: "10",
    },
    {
      semester: "IV",
      section: "B",
      subject: "TOC",
      numberOfStudents: "10",
    },
  ];

  return (
    <Wrapper>
      <Heading>Classes</Heading>
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
          <span className="my-auto underline underline-offset-2 font-semibold">
            Classes Taken
          </span>
        </div>
        <div className="bg-zinc-200/20 min-h-[50vh] py-2 px-1">
          <table className="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400 rounded-md overflow-hidden">
            <thead className="text-sm text-zinc-900 uppercase dark:bg-zinc-800/80 dark:text-zinc-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  S. No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Semester/Section
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  No. Of Students
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-200">
              {tableContent.map((cls, idx) => (
                <TableRow
                  key={idx}
                  ind={idx}
                  semester={cls.semester}
                  section={cls.section}
                  subject={cls.subject}
                  numberOfStudents={cls.numberOfStudents}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Wrapper>
  );
}

function TableRow({ key, ind, semester, section, subject, numberOfStudents }) {
  const navigate = useNavigate();

  return (
    <>
      <tr className="odd:dark:bg-zinc-700/60 even:bg-zinc-100 even:dark:bg-zinc-800 border-b dark:border-zinc-700 px-0 py-0 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/80">
        <td className="px-6 py-2 font-semibold">{ind + 1}.</td>
        <th
          scope="row"
          className="px-6 py-2 font-medium text-zinc-900 whitespace-nowrap dark:text-white text-md"
        >
          {semester} / {section}
        </th>
        <td className="px-6 py-2">{subject}</td>
        <td className="px-6 py-2">{numberOfStudents}</td>
        <td className="px-6 py-2">
          <Link to={semester + "-" + section}>
            <button
              type="button"
              className="px-2 py-1 rounded-md bg-zinc-400/70 text-zinc-950 font-medium hover:bg-zinc-400/90 transition-all active:ouline active:bg-zinc-500"
            >
              View
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
}

export default Classes;
