import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import animationData from "../assets/data.json";
import { useLottie } from "lottie-react";
import SuccErrSnackbar from "./Common/SuccErrSnackbar";
import { loginStudent } from "../../api/student";
import { loginTeacher } from "../../api/teacher";

// eslint-disable-next-line react/prop-types
export default function Homepage({ setToken }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  const [userType, setUserType] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  //* check if there is a user logged in already or not if logged in then nevigate to their home page
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const decode = jwtDecode(localStorage.getItem("authToken"));
      navigate(
        `${decode.usertype}/${decode._doc.department}/${decode._doc._id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  function handleLoginClick() {
    if (data.email === "" || data.password === "") {
      setErrorMessage("*All fields are mandatory. Please fill to proceed. ");
      return;
    }
    setApiCalled(true);
    //if uer is teacher
    if (userType === "teacher") {
      loginTeacher(data).then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        localStorage.setItem("authToken", JSON.stringify(res.data.authToken));
        setToken(res.data.authToken);
        navigate(`/teacher/${res.data.department}/${res.data.id}`);
      });
    }
    //if user is student
    if (userType === "student") {
      loginStudent(data).then((res) => {
        setApiCalled(false);
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        localStorage.setItem("authToken", JSON.stringify(res.data.authToken));
        setToken(res.data.authToken);
        navigate(`/student/${res.data.department}/${res.data.id}`);
      });
    }
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleLoginClick();
    }
  }

  return (
    <>
      <SuccErrSnackbar
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
      <div className="flex justify-center mx-auto h-full min-h-screen  w-4/5 items-center">
        <div className="  flex flex-1 justify-between border-rounded p-2 lg:flex-row md:flex-row xs:flex-col gap-1">
          <div className="lg:w-2/3  bg-indigo-200/90 p-8 flex flex-col rounded-[2%]">
            <h2 className="text-black lg:text-3xl xl:text-3xl md:text-2xl text-center font-mono sm:text-2xl xs:text-xl">
              Welcome BIT DURG
            </h2>
            <p className="text-slate-800 text-center font-display">
              Online ERP Module
            </p>
            <p className=" w-1/2 m-auto">{View}</p>
          </div>

          <div className="lg:w-1/3 bg-gray-300 p-6 rounded-[3%]">
            <h2 className="text-2xl text-center text-slate-800 font-medium font-main border-b-2 border-neutral-950 mb-3 mt-0  ">
              LOGIN
            </h2>

            <div className="mb-4 flex gap-3 ">
              <div
                onClick={() => setUserType("teacher")}
                className={`transition-all delay-200 ease-in-out text-slate-950  border rounded-lg text-center w-1/2 border-red-500 px-4 py-2  ${
                  userType === "teacher"
                    ? "bg-cyan-300/70  font-semibold"
                    : "font-light cursor-pointer font-mono"
                }`}
              >
                Teacher
              </div>
              <div
                onClick={() => setUserType("student")}
                className={`transition-all delay-200 ease-in-out text-slate-950  border rounded-lg text-center w-1/2 border-red-500 px-4 py-2 ${
                  userType === "student"
                    ? "bg-cyan-400 font-semibold"
                    : "font-light cursor-pointer font-mono"
                }`}
              >
                Student
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email*
              </label>
              <TextField
                required
                fullWidth
                placeholder="Email"
                className="text-slate-950 bg-white rounded-lg"
                name="email"
                onChange={(e) =>
                  setData((data) => ({ ...data, email: e.target.value }))
                }
                value={data.email}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Password*
              </label>
              <div className="flex align-middle justify-center gap-1">
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  placeholder="Password"
                  name="password"
                  className="text-slate-950 bg-white rounded-lg"
                  onChange={(e) =>
                    setData((data) => ({ ...data, password: e.target.value }))
                  }
                  value={data.password}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => setShowPassword((pass) => !pass)}
                        position="start"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={handleLoginClick}
              disabled={apiCalled}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
