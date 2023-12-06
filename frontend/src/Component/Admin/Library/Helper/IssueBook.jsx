/* eslint-disable react/prop-types */
import {
  Alert,
  Backdrop,
  Button,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getStudentDetails } from "../../../../../api/student";
import { useNavigate } from "react-router-dom";
import { getBookDetails } from "../../../../../api/admin";

function IssueBook() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSearchBookBackdrop, setOpenSearchBookBackdrop] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookId, setBookId] = useState("");
  const [bookData, setBookData] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    document.title = "Issue Books";
  }, []);
  const [openBackdrop, setOpenBackdrop] = useState(true);

  function handleSearchBook() {
    getBookDetails(bookId)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.error);
          return;
        }
        setBookData(res.book);
        return;
      })
      .catch((err) => setErrorMessage(err.message));
  }

  return (
    <div className="text-white flex flex-col w-full">
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={3000}
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
      {openBackdrop && (
        <StudentBackdrop
          data={data}
          setData={setData}
          openBackdrop={openBackdrop}
          setOpenBackdrop={setOpenBackdrop}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {data && (
        <div className="">
          <StudentDetails data={data} />
          <div className="flex flex-col align-center justify-center w-4/5 lg:w-3/4 mx-auto ">
            <div className="flex w-full justify-end mr-6 mb-5">
              <Button
                disabled={selectedBooks.length > 6}
                onClick={() => setOpenSearchBookBackdrop(true)}
                variant="outlined"
                color="success"
              >
                Add Book
              </Button>
              {openSearchBookBackdrop && (
                <div>
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={open}
                  >
                    <div className="w-1/3 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-5/6 sm:h-2/3 xs:h-2/3 relative bg-gray-200/80 flex justify-center flex-wrap align-center gap-3">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex w-full justify-end">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => setOpenSearchBookBackdrop(false)}
                          >
                            X
                          </Button>
                        </div>
                        {bookData === null ? (
                          <>
                            <TextField
                              onChange={(e) => setBookId(e.target.value)}
                              placeholder="Ex. Test0"
                              fullWidth
                              label="Boook ID"
                            />
                            <Button
                              onClick={handleSearchBook}
                              variant="outlined"
                              fullWidth
                              color="warning"
                            >
                              Search
                            </Button>
                          </>
                        ) : (
                          <>
                            <TextField
                              label="Book ID"
                              disabled
                              value={bookData.bookId}
                            />
                            <TextField
                              label="Book Name"
                              disabled
                              value={bookData.bookName}
                            />
                            <TextField
                              label="Author"
                              disabled
                              value={bookData.bookAuthor}
                            />
                            <TextField
                              label="Available Books"
                              disabled
                              value={bookData.availableNumberOfBooks}
                            />
                            <Button
                              color="success"
                              variant="contained"
                              onClick={() => {
                                setSelectedBooks((prev) => [
                                  ...prev,
                                  { ...bookData },
                                ]);
                                setBookData(null);
                                setOpenSearchBookBackdrop(false);
                              }}
                            >
                              Add
                            </Button>
                            <Button
                              color="warning"
                              variant="outlined"
                              onClick={() => setBookData(null)}
                            >
                              Cancle
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Backdrop>
                </div>
              )}
            </div>
            {selectedBooks.length > 0 && (
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>S. No.</b>
                        </TableCell>
                        <TableCell>
                          <b>Book ID</b>
                        </TableCell>
                        <TableCell>
                          <b>Book Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Author</b>
                        </TableCell>
                        <TableCell>
                          <b>Available No. Of Books</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBooks.map((row, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {idx + 1}
                          </TableCell>
                          <TableCell>{row.bookId}</TableCell>
                          <TableCell>{row.bookName}</TableCell>
                          <TableCell>{row.bookAuthor}</TableCell>
                          <TableCell>{row.availableNumberOfBooks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDetails({ data }) {
  return (
    <div className="bg-gray-200/80 w-4/5 lg:w-1/2 mx-auto text-center font-main shadow-md rounded-lg p-4 m-4">
      <h2 className="text-2xl text-black font-semibold mb-1">{data.name}</h2>
      <div className="text-gray-600 mb-1">
        <p>
          <span className="font-semibold">URN:</span> {data.urn}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {data.email}
        </p>
        <p>
          <span className="font-semibold">Department:</span> {data.department}
        </p>
        <p>
          <span className="font-semibold">Phone Number:</span>
          {data.phoneNumber}
        </p>
      </div>
    </div>
  );
}

function StudentBackdrop({
  openBackdrop,
  data,
  setData,
  setOpenBackdrop,
  setErrorMessage,
}) {
  const [urn, setUrn] = useState("");

  function handleSearch() {
    getStudentDetails(urn).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setData(res.data);
      return;
    });
  }

  return (
    <div>
      <Modal open={openBackdrop} onClose={() => setOpenBackdrop(false)}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <div className="w-1/3 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-5/6 sm:h-2/3 xs:h-2/3 relative bg-gray-200/80 flex justify-center flex-wrap align-center gap-3">
            <div className="flex flex-col gap-4 w-full">
              {data === null ? (
                <>
                  <TextField
                    onChange={(e) => setUrn(e.target.value)}
                    placeholder="Ex. 123123123123"
                    fullWidth
                    label="University Roll Number"
                  />
                  <Button
                    onClick={handleSearch}
                    variant="outlined"
                    fullWidth
                    color="warning"
                  >
                    Search
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    label="University Roll Number"
                    disabled
                    value={data.urn}
                  />
                  <TextField label="Name" disabled value={data.name} />
                  <TextField label="Email" disabled value={data.email} />
                  <TextField
                    label="Department"
                    disabled
                    value={data.department}
                  />
                  <TextField
                    label="Phone Number"
                    disabled
                    value={data.phoneNumber}
                  />
                  <Button
                    onClick={() => {
                      setData(data);
                      setOpenBackdrop(false);
                    }}
                    fullWidth
                    variant="contained"
                    color="success"
                  >
                    Proceed
                  </Button>
                  <Button
                    onClick={() => setData(null)}
                    fullWidth
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </Backdrop>
      </Modal>
    </div>
  );
}

export default IssueBook;
