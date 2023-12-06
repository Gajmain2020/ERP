/* eslint-disable react/prop-types */
import { Alert, Snackbar } from "@mui/material";

export default function ErrSuccSnackbar({
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
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
          sx={{ width: "100%" }}
        >
          {successMessage}
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
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
