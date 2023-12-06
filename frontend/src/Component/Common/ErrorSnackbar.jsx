/* eslint-disable react/prop-types */
import { Alert, Snackbar } from "@mui/material";

export default function ErrorSnackbar({ errorMessage, setErrorMessage }) {
  return (
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
  );
}
