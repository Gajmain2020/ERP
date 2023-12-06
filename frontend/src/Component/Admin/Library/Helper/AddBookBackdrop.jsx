/* eslint-disable react/prop-types */
import {
  Backdrop,
  Button,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Papa from "papaparse";
import CloseIcon from "@mui/icons-material/Close";
import { addMultipleBooks, addSingleBook } from "../../../../../api/admin";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddBookBackdrop({
  setToken,
  setErrorMessage,
  setSuccessMessage,
  openBookAdd,
  setOpenAddBook,
}) {
  const navigate = useNavigate();
  const initialSingleBookData = {
    bookName: "",
    bookAuthor: "",
    bookId: "",
    priceOfBook: "",
    numberOfBooks: "",
    department: "",
  };
  const department = ["CIVIL", "CSE", "EE", "EEE", "IT", "MECH", "ETC"];
  const [option, setOption] = useState(0);
  const [singleBookData, setSingleBookData] = useState(initialSingleBookData);
  const [apiCalled, setApiCalled] = useState(false);
  const [fileName, setFileName] = useState("No file selected.");
  const [data, setData] = useState([]);

  function handleCloseBackdrop() {
    setOpenAddBook(false);
    setOption(0);
    return;
  }

  function handleInputChange(e) {
    setSingleBookData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAddSingleBook() {
    setApiCalled(true);
    if (
      singleBookData.bookName === "" ||
      singleBookData.bookId === "" ||
      singleBookData.bookAuthor === "" ||
      singleBookData.numberOfBooks === "" ||
      singleBookData.department === "" ||
      singleBookData.priceOfBook === ""
    ) {
      setErrorMessage("All Fields Are Mandatory");
      setApiCalled(false);
      return;
    }

    //! get Your API call
    addSingleBook(singleBookData).then((res) => {
      setApiCalled(false);

      if (res?.tokenExpired) {
        alert(res.message);
        localStorage.removeItem("authToken");
        setToken("");
        navigate("/");
        return;
      }
      if (res.success === false) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setSingleBookData(initialSingleBookData);
      return;
    });
  }

  function handleFileUpload(e) {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (res) {
        const columnArray = [];
        const valueArray = [];

        res.data.map((d) => {
          columnArray.push(Object.keys(d));
          valueArray.push(Object.values(d));
        });

        setData(() => res.data);
      },
    });
  }

  function handleUnloadFile() {
    setFileName("No file selected.");
    setData([]);
  }
  function handleAddMultipleBooks() {
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].bookId === "" ||
        data[i].bookName === "" ||
        data[i].bookAuthor === "" ||
        data[i].department === "" ||
        data[i].numnberOfBooks === "" ||
        data[i].priceOfBook === ""
      ) {
        setErrorMessage(
          "Some fields are empty in CSV file. Please update CSV and Upload."
        );
        return;
      }
    }
    addMultipleBooks(data)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setSuccessMessage(res.message);
        handleCloseBackdrop();
        handleUnloadFile();
      })
      .catch((err) => setErrorMessage(err.message));
  }

  function handleViewData() {
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `http://127.0.0.1:5173/show-data/${encodedData}`;
    window.open(url, "_blank", "width=800 height=600");
  }

  return (
    <>
      <Modal open={openBookAdd} onClose={() => setOpenAddBook(false)}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-1/2 sm:h-2/3 xs:h-2/3 relative lg:flex-nowrap bg-gray-200/50 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
            <div className="absolute top-1 right-1">
              <Button
                onClick={handleCloseBackdrop}
                color="error"
                size="small"
                variant="contained"
              >
                <CloseIcon />
              </Button>
            </div>
            <Button
              className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
              fullWidth
              variant="contained"
              onClick={() => {
                setOption(1);
              }}
            >
              Add Single Book
            </Button>
            <Button
              className="btn lg:h-2/5 sm:h-1/3 xs:h-1/3"
              fullWidth
              variant="contained"
              onClick={() => {
                setOption(2);
              }}
            >
              Add Books Via CSV Sheet
            </Button>
          </div>
        </Backdrop>
      </Modal>
      {option !== 0 && option === 1 && (
        <Modal open={option === 1} onClose={handleCloseBackdrop}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <div className="w-1/2 lg:h-max xs:h-5/6 sm:w-4/5 xs:w-4/5 p-10 rounded-lg sm:h-3/4 md:h-3/4  relative lg:flex-nowrap bg-gray-200/50 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
              <div className="absolute top-1 right-1">
                <Button
                  onClick={handleCloseBackdrop}
                  color="error"
                  size="small"
                  variant="contained"
                >
                  <CloseIcon />
                </Button>
              </div>
              <div className="flex flex-col gap-4 w-4/5">
                <div className="text-2xl text-center font-main text-red-100">
                  Add Single Book
                </div>
                <div className="flex lg:flex-row gap-4 sm:flex-col xs:flex-col">
                  <TextField
                    label="Book ID"
                    className="lg:w-1/2 w-full"
                    onChange={handleInputChange}
                    value={singleBookData.bookId}
                    name="bookId"
                  />
                  <TextField
                    label="Book Name"
                    onChange={handleInputChange}
                    value={singleBookData.bookName}
                    className="lg:w-1/2 w-full"
                    name="bookName"
                  />
                </div>
                <div className="flex lg:flex-row gap-4 sm:flex-col xs:flex-col">
                  <TextField
                    label="Book Author"
                    onChange={handleInputChange}
                    value={singleBookData.bookAuthor}
                    className="lg:w-1/2 w-full"
                    name="bookAuthor"
                  />
                  <TextField
                    label="Department"
                    onChange={handleInputChange}
                    value={singleBookData.department}
                    select
                    className="lg:w-1/2 w-full"
                    helperText="Please Select Department."
                    name="department"
                  >
                    {department.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="flex lg:flex-row gap-4 sm:flex-col xs:flex-col">
                  <TextField
                    onChange={handleInputChange}
                    value={singleBookData.priceOfBook}
                    label="Price Of Single Book"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    className="lg:w-1/2 w-full"
                    name="priceOfBook"
                  />
                  <TextField
                    label="Number of Books"
                    onChange={handleInputChange}
                    value={singleBookData.numberOfBooks}
                    className="lg:w-1/2 w-full"
                    type="number"
                    name="numberOfBooks"
                  />
                </div>
                <Button
                  onClick={handleAddSingleBook}
                  disabled={apiCalled}
                  fullWidth
                  variant="contained"
                  color="success"
                >
                  Add Book
                </Button>
              </div>
            </div>
          </Backdrop>
        </Modal>
      )}
      {option !== 0 && option === 2 && (
        <Modal open={option === 2} onClose={handleCloseBackdrop}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <div className="w-1/2 lg:h-max xs:h-5/6 sm:w-4/5 xs:w-4/5 p-10 rounded-lg sm:h-3/4 md:h-3/4  relative lg:flex-nowrap bg-gray-200/80 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
              <div className="absolute top-1 right-1">
                <Button
                  onClick={handleCloseBackdrop}
                  color="error"
                  size="small"
                  variant="contained"
                >
                  <CloseIcon />
                </Button>
              </div>
              <div className="flex flex-col gap-4 w-4/5">
                <div className="text-2xl text-center font-main text-gray-800">
                  Add Multiple Books VIA CSV Sheet
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <TextField disabled fullWidth value={fileName} />
                    {fileName !== "No file selected." && (
                      <>
                        <Button
                          onClick={handleUnloadFile}
                          variant="contained"
                          color="error"
                          size="large"
                        >
                          <DeleteIcon fontSize="large" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button variant="contained" component="label" fullWidth>
                      Upload File
                      <input
                        onChange={handleFileUpload}
                        type="file"
                        accept=".csv"
                        hidden
                      />
                    </Button>
                    {fileName !== "No file selected." && (
                      <>
                        <Button
                          onClick={handleAddMultipleBooks}
                          variant="contained"
                          fullWidth
                          color="success"
                          size="large"
                        >
                          Proceed
                        </Button>
                        <Button size="small" onClick={handleViewData}>
                          Click Here To Varify Data
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Backdrop>
        </Modal>
      )}
    </>
  );
}
