import { useLocation, useNavigate } from "react-router-dom";
import Library from "./Library/Library";
import { useEffect } from "react";
import Academic from "./Academic/Academic";
import AcademicDepartment from "./AcademicDepartment/AcademicDepartment";

export default function DeptRoute({ setToken, token }) {
  const location = useLocation().pathname.split("/")[2];
  const navigate = useNavigate();
  const departments = ["CIVIL", "CSE", "EE", "EEE", "ETC", "IT", "MECH"];
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (location === "Library") {
    return (
      <>
        <Library setToken={setToken} />
      </>
    );
  }
  if (location === "Academics") {
    return (
      <>
        <Academic setToken={setToken} />
      </>
    );
  }
  if (departments.includes(location)) {
    return (
      <>
        <AcademicDepartment setToken={setToken} />
      </>
    );
  }
  return (
    <div className="bg-red-200 p-10 text-red-900">
      hello world create a new component bro
    </div>
  );
}
