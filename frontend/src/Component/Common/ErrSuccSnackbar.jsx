/* eslint-disable react/prop-types */
import { Alert, Snackbar } from "@mui/material";

export default function ErrSuccSnackbar({
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
  warningMessage,
  setWraningMessage,
}) {
  return (
    <>
      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={3200}
        onClose={() => setSuccessMessage("")}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={warningMessage !== ""}
        autoHideDuration={3200}
        onClose={() => setWraningMessage("")}
      >
        <Alert
          onClose={() => setWraningMessage("")}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {warningMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={3200}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
