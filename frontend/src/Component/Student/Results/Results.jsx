import { Link, useParams } from "react-router-dom";
import Heading from "../../Common/Heading";
import Wrapper from "../../Common/Wrapper";

const dummyResult = [
  {
    examName: "ESE 2021-22",
    session: "Jan-June",
    semester: "III",
  },
  {
    examName: "ESE 2021-22",
    session: "Jan-June",
    semester: "III",
  },
  {
    examName: "ESE 2021-22",
    session: "Jan-June",
    semester: "III",
  },
  {
    examName: "ESE 2021-22",
    session: "Jan-June",
    semester: "III",
  },
];

export default function Results() {
  const { id } = useParams();
  return (
    <Wrapper>
      <Heading>Results</Heading>
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
                Session
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
            {dummyResult.map((res, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-500/60 even:bg-gray-400/60 border-bborder-gray-700 hover:bg-gray-900/70 transition hover:text-white"
              >
                <td className="px-4 py-3">{idx + 1}.</td>
                <td className="px-6 py-3">{res.examName}</td>
                <td className="px-6 py-3">{res.session}</td>
                <td className="px-6 py-3">{res.semester}</td>
                <td className="px-6 py-3">
                  <Link to={`${res.session + "_" + res.semester + "_" + id}`}>
                    <span className="bg-sky-200 px-3 py-1 text-black rounded-md hover:bg-sky-300 transition">
                      View
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}
