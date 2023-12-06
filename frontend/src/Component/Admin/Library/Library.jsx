/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import AddBookBackdrop from "./Helper/AddBookBackdrop";
import { useNavigate } from "react-router-dom";

export default function Library({ setToken }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openBookAdd, setOpenBookAdd] = useState(false);

  useEffect(() => {
    document.title = "Library Module";
  }, []);
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
      <div className="w-4/5 flex justify-middle align-middle border-rounded p-2 lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 ">
        <div className="mx-auto w-full text-white">
          <h1 className="text-4xl flex gap-2 justify-center flex-col text-center font-main heading mx-auto">
            Welcome Admin
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="w-full mt-4">
          <div className=" mx-auto bg-gray-100/50 p-6 rounded-md shadow-md">
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    onClick={() => setOpenBookAdd(true)}
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Add Book
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                    onClick={() => navigate("issue-book")}
                  >
                    Issue Books
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Edit / Remove Book(s)
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    className="btn"
                    variant="contained"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Return Books
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    variant="contained"
                    className="btn"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Requested Books
                  </Button>
                </div>
                <div className="w-1/2 sm:w-full  xs:w-full sm:mb-4 xs:mb-4">
                  <Button
                    variant="contained"
                    className="btn"
                    sx={{ height: "130%" }}
                    fullWidth
                  >
                    Complaints
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openBookAdd && (
        <AddBookBackdrop
          setToken={setToken}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          openBookAdd={openBookAdd}
          setOpenAddBook={setOpenBookAdd}
        />
      )}
    </>
  );
}
