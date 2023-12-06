import { useState } from "react";
import complainIcon from "../../images/complain.png";
import { Alert, Button, MenuItem, Snackbar, TextField } from "@mui/material";
import { submitComplain } from "../../../api/common";

export default function Complaints() {
  const options = [
    "",
    "Library",
    "Announcements",
    "Exam",
    "Accounts",
    "CSE",
    "CIVIL",
    "EE",
    "EEE",
    "ETC",
    "IT",
    "MECH",
  ];
  const initialFormData = {
    name: "",
    email: "",
    userType: "",
    phoneNumber: "",
    department: "",
    complaintText: "",
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiCalled, setApiCalled] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleComplaintSubmit() {
    setApiCalled(true);
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.phoneNumber === "" ||
      formData.department === "" ||
      formData.userType === "" ||
      formData.complaintText === ""
    ) {
      setErrorMessage("All fields are mandatory to fill.");
      setApiCalled(false);
      return;
    }
    submitComplain(formData).then((res) => {
      setApiCalled(false);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setFormData(initialFormData);
      return;
    });
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
      <div className="w-4/5 mt-4">
        <div className=" mx-auto bg-gray-200/70 p-6 rounded-md shadow-md">
          <h2 className="text-2xl text-center font-main font-semibold mb-4">
            Complaint Form
          </h2>
          <div className="flex justify-between bg-amber-300/70 rounded-lg p-10 sm:p-5">
            <div className="flex flex-col justify-center align-middle w-full">
              <img
                className="mx-auto lg:w-32 lg:h-32 sm:w-16 sm:h-16 xs:h-20 xs:w-20"
                src={complainIcon}
                alt=""
              />
              <span className="text-main text-center sm:text-sm xs:text-sm">
                We apologize for any inconvenience caused. Please provide us
                with details of your complaint so that we can address it
                promptly.
                <br /> <span className="font-semibold">Thank you !</span>
              </span>
            </div>
          </div>
          <form className="sm:mt-2 xs:mt-2">
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/2 sm:w-full xs:w-full">
                  <TextField
                    name="name"
                    label="Name"
                    onChange={handleInputChange}
                    fullWidth
                    value={formData.name}
                    placeholder="Ex. Jone Doe"
                  />
                </div>
                <div className="w-1/2 sm:w-full xs:w-full">
                  <TextField
                    name="email"
                    label="Email"
                    onChange={handleInputChange}
                    fullWidth
                    value={formData.email}
                    placeholder="Ex. jone@mail.com"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap">
                <div className="w-1/3 sm:w-full xs:w-full">
                  <TextField
                    name="department"
                    label="Department"
                    onChange={handleInputChange}
                    fullWidth
                    select
                    value={formData.department}
                    placeholder="Ex. Jone Doe"
                    helperText="Please select conserned department."
                  >
                    {options.map((opt) => (
                      <MenuItem className="w-4/5" key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="w-1/3 sm:w-full xs:w-full">
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    onChange={handleInputChange}
                    fullWidth
                    value={formData.phoneNumber}
                    placeholder="Ex. 1234567890"
                  />
                </div>
                <div className="w-1/3 sm:w-full xs:w-full">
                  <TextField
                    name="userType"
                    select
                    label="User Type"
                    onChange={handleInputChange}
                    fullWidth
                    value={formData.userType}
                    helperText="Please your user type."
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <TextField
                name="complaintText"
                placeholder="Start writing your complaint here....."
                label="Complaint Text"
                value={formData.complaintText}
                fullWidth
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </div>
            <div className="mb-4">
              <Button
                onClick={handleComplaintSubmit}
                disabled={apiCalled}
                fullWidth
                variant="contained"
                color="success"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
//!make api call to save complain
