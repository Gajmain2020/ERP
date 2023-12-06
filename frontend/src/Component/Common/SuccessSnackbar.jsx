/* eslint-disable react/prop-types */
import { Snackbar, Alert } from "@mui/material";

export default function SuccessSnackbar({ successMessage, setSuccessMessage }) {
  return (
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
  );
}
