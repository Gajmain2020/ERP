import Wrapper from "../../Common/Wrapper";
import Heading from "../../Common/Heading";
import DownloadIcon from "@mui/icons-material/Download";

const dummyPyq = [
  {
    _id: "1",
    session: "Jan-Jun 2023",
    examName: "ESE-2023",
    semester: "III",
    courseShortName: "DWM",
    courseCode: "102601CS",
  },
  {
    _id: "2",
    session: "Jan-Jun 2023",
    examName: "ESE-2023",
    semester: "III",
    courseShortName: "DWM",
    courseCode: "102601CS",
  },
  {
    _id: "3",
    session: "Jan-Jun 2023",
    examName: "ESE-2023",
    semester: "III",
    courseShortName: "DWM",
    courseCode: "102601CS",
  },
  {
    _id: "4",
    session: "Jan-Jun 2023",
    examName: "ESE-2023",
    semester: "III",
    courseShortName: "DWM",
    courseCode: "102601CS",
  },
];

export default function PYQ() {
  function handleDownloadPaper(id) {
    console.log(id);
  }

  return (
    <Wrapper>
      <Heading>Previous Year Question Papers</Heading>
      <div className="relative overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-100">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                S.NO.
              </th>
              <th scope="col" className="px-6 py-3">
                Session
              </th>
              <th scope="col" className="px-6 py-3">
                Exam Name
              </th>
              <th scope="col" className="px-6 py-3">
                Course
              </th>
              <th scope="col" className="px-6 py-3">
                Semester
              </th>
              <th scope="col" className="px-6 py-3">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-200  font-semibold">
            {dummyPyq.map((res, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-500/60 even:bg-gray-400/60 border border-gray-700 hover:bg-gray-900/70 transition hover:text-white"
              >
                <td className="px-4 py-3">{idx + 1}.</td>
                <td className="px-6 py-3">{res.session}</td>
                <td className="px-6 py-3">{res.examName}</td>
                <td className="px-6 py-3">
                  {res.courseShortName}{" "}
                  <span className="text-xs text-gray-200/70">
                    {res.courseCode}
                  </span>
                </td>
                <td className="px-6 py-3">{res.semester}</td>
                <td className="px-6 py-3">
                  <span
                    onClick={() => handleDownloadPaper(res._id)}
                    className="bg-slate-400 px-3 py-1 text-black rounded-md hover:bg-slate-600 hover:text-white transition cursor-pointer"
                  >
                    <DownloadIcon fontSize="small" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "}
    </Wrapper>
  );
}
