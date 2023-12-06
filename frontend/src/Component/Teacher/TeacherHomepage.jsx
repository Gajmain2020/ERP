import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherHomepage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <div
        className="w-4/5 flex justify-middle align-middle border-rounded p-2
      lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 "
      >
        <div className="mx-auto w-full text-white">
          <h1 className="text-4xl flex gap-2 justify-center flex-col text-center font-main heading mx-auto">
            Welcome Teacher
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="w-full mt-4">
          <div className=" mx-auto bg-gray-100/50 p-6 rounded-md shadow-md">
            <div className="text-xl text-gray-700 underline">Academic ::</div>
            <div className="mb-2">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => navigate("add-attandance")}
                  >
                    Add Attandance
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => alert("backdrop componetn")}
                  >
                    Release Assignment
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => alert("navigate to diffn")}
                  >
                    View Assignments
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => alert("navigate to diffn")}
                  >
                    Add Class Test Marks
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => alert("navigate to diffn")}
                  >
                    Add Notice
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "110%", marginX: "auto" }}
                    fullWidth
                    onClick={() => navigate("validate-students")}
                  >
                    Validate Students
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ! features for teacher
//adding attandance
//releasing assignment ---pdf formate only
//adding marks
//adding ct marks
//adding notice
//viewing assignments
