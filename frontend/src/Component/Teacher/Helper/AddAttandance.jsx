import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../Common/Heading";
import {
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Paper,
  TableBody,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchClassesForTeacher } from "../../../../api/teacher";
import ErrorSnackbar from "../../Common/ErrorSnackbar";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

export default function AddAttandance() {
  document.title = "Add Attandance";
  const navigate = useNavigate();
  const { id } = useParams();
  const [classes, setClasses] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchClassesForTeacher(id)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          return;
        }
        setClasses(res.classes);
      })
      .catch((err) => setErrorMessage(err));
  }, [id]);

  return (
    <>
      <ErrorSnackbar
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <div
        className="w-4/5 flex justify-middle align-middle border-rounded p-2
      lg:mt-4 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 "
      >
        <Heading headingTitle={"Add Attandance"} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#D0D4CA" }}>
              <TableRow>
                <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                  S. No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Semester</TableCell>
                <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {classes === null && (
                  <TableCell align="center" colSpan={5}>
                    LOADING ....
                  </TableCell>
                )}
                {classes !== null && classes.length === 0 && (
                  <TableCell align="center" colSpan={5}>
                    No Classes Found
                  </TableCell>
                )}
              </TableRow>
              {classes !== null &&
                classes.length > 0 &&
                classes.map((cls, idx) => (
                  <TableRow key={cls._id}>
                    <TableCell>{idx + 1}.</TableCell>
                    <TableCell>{cls.subjectShortName}</TableCell>
                    <TableCell>{cls.section}</TableCell>
                    <TableCell>{cls.semester}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(
                            `${cls.subjectShortName}_${cls.section}_${cls.semester}`
                          )
                        }
                        color="success"
                        size="small"
                      >
                        <DoubleArrowIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
