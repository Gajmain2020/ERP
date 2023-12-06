import { useState } from "react";
import {
  deleteMultipleStudents,
  deleteSingleStudent,
  editSingleStudent,
  fetchAllStudents,
} from "../../../../../api/admin";
import {
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Checkbox,
  Button,
  Backdrop,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import CloseIcon from "@mui/icons-material/Close";

const dept = ["", "CIVIL", "CSE", "EE", "EEE", "ETC", "IT", "MECH"];
const semester = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function EditRemoveStudent() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [check, setCheck] = useState(null);

  useState(() => {
    document.title = "Edit Remove Students";

    fetchAllStudents().then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setStudents(res.students);
      return;
    });
  }, []);

  function handleSingleEditClick(row) {
    setStudent(row);
    setCheck(row);
  }
  function handleEditSingleStudent() {
    if (student === check) {
      const confirmClose = window.confirm(
        "No change detected. Do you want to close modal?"
      );
      if (confirmClose) {
        setStudent(null);
        setCheck(null);
        return;
      }
      return;
    }
    editSingleStudent({ ...student, oldEmail: check.email }).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      const idx = students.indexOf(check);
      students[idx] = student;
      setStudent(null);
    });
  }
  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelectedStudents(() => students);
      return;
    }
    setSelectedStudents([]);
  }
  function handleSelectSingle(e, row) {
    if (e.target.checked) {
      setSelectedStudents((prev) => [...prev, row]);
      return;
    }
    setSelectedStudents((prev) => prev.filter((stu) => stu.urn !== row.urn));
  }
  function handleMultipleDelete() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedStudents.length} studens from database?`
    );
    if (!confirmDelete) {
      return;
    }
    deleteMultipleStudents(selectedStudents).then((res) => {
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setStudents((prev) =>
        prev.filter((stu) => !selectedStudents.includes(stu))
      );
      setSelectedStudents([]);
    });
  }
  function handleSingleDeleteClick(row) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${row.urn} from database?`
    );
    if (confirmDelete) {
      // make api call to delete single Student
      deleteSingleStudent(row)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.message);
            return;
          }
          setSuccessMessage(res.message);
          setSelectedStudents((prev) =>
            prev.filter((stu) => stu.urn !== row.urn)
          );
          setStudents((prev) => prev.filter((stu) => stu.urn !== row.urn));
          return;
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
  }

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
            Edit Or Remove Students
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="flex w-full">
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
                {selectedStudents.length !== 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <i>
                        <b>
                          Delete {selectedStudents.length} students from the
                          database.
                        </b>
                      </i>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={handleMultipleDelete} size="small">
                        <DeleteForeverTwoToneIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <i>
                        <b>No student(s) selected yet.</b>
                      </i>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>
                    <b>
                      <Checkbox onChange={handleSelectAll} size="small" />
                      Select
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>URN</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex w-full justify-center">
                          Loading .....
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {students.length !== 0 &&
                  students.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(row)}
                          size="small"
                          onChange={(e) => handleSelectSingle(e, row)}
                        />
                      </TableCell>
                      <TableCell>{row.urn}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleSingleEditClick(row)}
                          size="small"
                        >
                          <ModeEditOutlineTwoToneIcon color="warning" />
                        </IconButton>
                        {"/"}
                        <IconButton
                          onClick={() => handleSingleDeleteClick(row)}
                          size="small"
                        >
                          <DeleteForeverTwoToneIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Modal open={student !== null} onClose={() => setStudent(null)}>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
          >
            <div className="w-1/2 sm:w-4/5 xs:w-4/5 p-10 rounded-lg lg:h-4/6 sm:h-2/3 xs:h-2/3 relative flex-nowrap bg-gray-200/90 flex justify-center items-center gap-10 sm:flex-wrap xs:flex-wrap">
              <div className="absolute top-1 right-1">
                <Button
                  onClick={() => setStudent(null)}
                  color="error"
                  size="small"
                  variant="contained"
                >
                  <CloseIcon />
                </Button>
              </div>
              <div className="flex w-full h-full flex-col gap-3">
                <TextField
                  label="URN"
                  disabled
                  value={student?.urn}
                  name="urn"
                  fullWidth
                />
                <TextField
                  value={student?.name}
                  label="Name"
                  name="name"
                  fullWidth
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  value={student?.email}
                  label="Email"
                  name="email"
                  fullWidth
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  select
                  label="Department"
                  value={student?.department}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  name="department"
                  fullWidth
                >
                  {dept.map((y) => (
                    <MenuItem value={y} key={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Semester"
                  value={student?.semester}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  name="semester"
                  fullWidth
                >
                  {semester.map((y) => (
                    <MenuItem value={y} key={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
                <div className="flex gap-3">
                  <Button
                    onClick={handleEditSingleStudent}
                    color="success"
                    fullWidth
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setStudent(null)}
                    color="error"
                    fullWidth
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Backdrop>
        </Modal>
      </div>
    </>
  );
}
