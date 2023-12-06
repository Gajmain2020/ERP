/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Button,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchStudentDetailsById,
  saveStudentDetails,
} from "../../../api/student";
import user from "../../images/user.png";

const states = [
  "",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const initialDetails = {
  dob: "",
  bloodGroup: "",
  admissionNumber: "",
  gender: "",
  category: "",
  aadharNumber: "",
  studentMobileNumber: "",
  guardianMobileNumber1: "",
  guardianMobileNumber2: "",
  permanentAddress: "",
  pinCode: "",
  state: "",
  profilePhoto: "",
};

export default function StudentHomepage() {
  const navigate = useNavigate();
  const id = useLocation().pathname.split("/")[3];
  const [errorMessage, setErrorMessage] = useState("");
  const [apiCalled, setApiCalled] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [student, setStudent] = useState(null);
  const [openCompleteProfile, setOpenCompleteProfile] = useState(false);
  const [details, setDetails] = useState(initialDetails);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchStudentDetailsById(id)
      .then((res) => {
        if (!res.success) {
          setErrorMessage(res.message);
          navigate("/");
          return;
        }
        setStudent(res.student);
      })
      .catch((err) => setErrorMessage(err.message));
  }, []);

  function handleDetailsChange(e) {
    setDetails((details) => ({ ...details, [e.target.name]: e.target.value }));
  }
  function handleSubmitDetails() {
    if (
      details.dob === "" ||
      !details.bloodGroup === "" ||
      !details.admissionNumber === "" ||
      !details.gender === "" ||
      !details.category === "" ||
      !details.aadharNumber === "" ||
      !details.studentMobileNumber === "" ||
      !details.guardianMobileNumber1 === "" ||
      !details.guardianMobileNumber2 === "" ||
      !details.permanentAddress === "" ||
      !details.pinCode === "" ||
      !details.state === "" ||
      image === ""
    ) {
      setErrorMessage("* All fields are mandatory to fill.");
      return;
    }
    setApiCalled(true);
    setDetails((details) => ({
      ...details,
      permanentAddress:
        details.permanentAddress + "-" + details.state + "-" + details.pinCode,
    }));
    //making api call to store data in database
    saveStudentDetails({ details, image, student }).then((res) => {
      setApiCalled(false);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setStudent((student) => ({ ...student, detailsFilled: true }));
      return;
      //will nevigate to a static page
    });
  }

  function handleProfilePhotoUpload(e) {
    if (e.target.files[0].size > 100000) {
      setErrorMessage("Profile photo size must be 10kB to 60kB.");
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(() => reader.result);
    };
    reader.onerror = (error) => {
      console.log(error);
    };
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
      <div
        className="w-4/5 flex justify-middle align-middle border-rounded p-2
      lg:mt-8 md:mt-16 sm:mt-16 flex-col xs:mt-8 gap-8 "
      >
        <div className="mx-auto w-full text-white">
          <h1 className="text-4xl flex gap-2 justify-center flex-col text-center font-main heading mx-auto">
            Welcome Student
            <span className="text-sm  text-gray-300/80">
              BIT DURG Online ERP Module
            </span>
          </h1>
        </div>
        <div className="w-full mt-4">
          <div className=" mx-auto bg-gray-100/70 p-6 rounded-md shadow-md">
            {student === null && (
              <>
                <div className="flex justify-center w-full text-2xl">
                  Loading...
                </div>
              </>
            )}

            {/* the student have not been verified and have not filled the form as well */}
            {student !== null &&
              !student.isVerified &&
              !student.detailsFilled &&
              !openCompleteProfile && (
                <div className="mb-4">
                  <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                    <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                      <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md my-4">
                        <div className="flex">
                          <div className="py-1">
                            <svg
                              className="fill-current h-6 w-6 text-blue-500 mr-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H8v6h4V6h-1a1 1 0 0 1 0-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-md">
                              Your student account has been created! Please
                              complete your profile by adding all the necessary
                              details correctly, as they will be verified by
                              your Teacher Guardian.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center w-5/6 mx-auto mt-10">
                        <Button
                          className="btn"
                          onClick={() => setOpenCompleteProfile(true)}
                          variant="contained"
                          sx={{ height: "100%", marginX: "auto" }}
                          fullWidth
                        >
                          Complete Profile Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/*  if the student want to fill his or her details then wil show this form to fill his details */}
            {student !== null &&
              !student.isVerified &&
              !student.detailsFilled &&
              openCompleteProfile && (
                <div className="mb-4">
                  <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                    <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                      <div className="mx-auto flex justify-center text-2xl text-red-950 font-semibold underline">
                        Complete Student Profile
                      </div>
                      {/* form begin here */}
                      <div className="my-5">
                        <div className="flex justify-center gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <div className="flex flex-col">
                            <img
                              src={image !== "" ? image : user}
                              width={120}
                              height={120}
                              style={{ borderRadius: "50%" }}
                            />
                            <Button component="label" fullWidth>
                              Upload File
                              <input
                                onChange={handleProfilePhotoUpload}
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                hidden
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed">
                            <TextField
                              label="Name"
                              value={student.name}
                              fullWidth
                              disabled
                            />
                          </div>
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed">
                            <TextField
                              label="University Roll Number"
                              value={student.urn}
                              fullWidth
                              disabled
                            />
                          </div>
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed">
                            <TextField
                              label="Email"
                              value={student.email}
                              fullWidth
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed">
                            <TextField
                              label="Class Roll Number"
                              value={student.crn}
                              fullWidth
                              disabled
                            />
                          </div>
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed">
                            <TextField
                              label="Semester"
                              value={student.semester}
                              fullWidth
                              disabled
                            />
                          </div>
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed ">
                            <TextField
                              label="Section"
                              value={student.section}
                              fullWidth
                              disabled
                            />
                          </div>
                          <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4 cursor-not-allowed ">
                            <TextField
                              label="TG(Name-ID)"
                              value={student.TG}
                              fullWidth
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <TextField
                            label="Date Of Birth"
                            name="dob"
                            type="date"
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.dob}
                          />
                          <TextField
                            label="Blood Group"
                            name="bloodGroup"
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.bloodGroup}
                          />
                          <TextField
                            label="Admission Number"
                            name="admissionNumber"
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.admissionNumber}
                          />
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <TextField
                            label="Gender"
                            name="gender"
                            select
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.gender}
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </TextField>
                          <TextField
                            label="Category"
                            name="category"
                            select
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.category}
                          >
                            <MenuItem value="general">General</MenuItem>
                            <MenuItem value="obc">OBC</MenuItem>
                            <MenuItem value="ST">ST</MenuItem>
                            <MenuItem value="SC">SC</MenuItem>
                          </TextField>
                          <TextField
                            label="Aadhar Number"
                            name="aadharNumber"
                            type="number"
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.aadharNumber}
                          />
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <TextField
                            label="Student Mobile Number"
                            name="studentMobileNumber"
                            type="number"
                            onChange={handleDetailsChange}
                            value={details?.studentMobileNumber}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            label="Guardian 1 Mobile Number"
                            name="guardianMobileNumber1"
                            type="number"
                            onChange={handleDetailsChange}
                            value={details?.guardianMobileNumber1}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Guardian 2 Mobile Number"
                            name="guardianMobileNumber2"
                            type="number"
                            onChange={handleDetailsChange}
                            value={details?.guardianMobileNumber2}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                          <TextField
                            label="Permanent Address"
                            name="permanentAddress"
                            type="number"
                            multiline
                            rows={3}
                            fullWidth
                            onChange={handleDetailsChange}
                            value={details?.permanentAddress}
                          />
                          <div className="flex w-full gap-2 flex-col">
                            <TextField
                              label="Pin Code"
                              name="pinCode"
                              type="number"
                              fullWidth
                              onChange={handleDetailsChange}
                              value={details?.pinCode}
                            />
                            <TextField
                              label="State"
                              name="state"
                              fullWidth
                              size="small"
                              select
                              onChange={handleDetailsChange}
                              value={details?.state}
                            >
                              {states.map((s) => (
                                <MenuItem value={s} key={s}>
                                  {s}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </div>
                        <div className="my-5">
                          <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                            <Button
                              variant="outlined"
                              color="warning"
                              onClick={() => {
                                setOpenCompleteProfile(false);
                                setDetails(null);
                              }}
                              fullWidth
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleSubmitDetails}
                              fullWidth
                              disabled={apiCalled}
                            >
                              {apiCalled ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* The student is not yet verified but have filled the validation form */}
            {student !== null &&
              !student.isVerified &&
              student.detailsFilled && (
                <div className="mb-0">
                  <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                    <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                      <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md my-0">
                        <div className="flex">
                          <div className="py-1">
                            <svg
                              className="fill-current h-6 w-6 text-blue-500 mr-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H8v6h4V6h-1a1 1 0 0 1 0-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg">
                              Your profile has been sent to your Teacher
                              Guardian for validation and review. You will be
                              able to use the features of LMS/ERP after the
                              validation process is completed. <br />
                              <span className="text-blue-950">
                                Thank you for your patience!!
                              </span>
                              <br />
                              <span className="text-blue-950">
                                Have a great day...
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* The student is verified and can access all the features */}
            {student !== null && student.isVerified && (
              <div className="mb-0">
                <div className="flex gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                  <div className="w-1/2 sm:w-full xs:w-full sm:mb-4 xs:mb-4">
                    {/* ACADEMIC STARTS HERE */}
                    <div className="my-4">
                      <div className="text-xl text-gray-700 underline">
                        Academic ::
                      </div>
                      <div className="flex justify-center gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Attendance Status
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Exam Results
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Assignments
                        </Button>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex justify-center gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Attendence Subjectwise
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Co curricular activities
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Current Backlog
                        </Button>
                      </div>
                    </div>
                    {/* ACADEMIC ENDS HERE */}
                    {/* ACADEMIC STARTS HERE */}
                    <div className="my-4">
                      <div className="text-xl text-gray-700 underline">
                        Other ::
                      </div>
                      <div className="flex justify-center gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Fee Payment
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Fee Recipt
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          News And Notice
                        </Button>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex justify-center gap-4 lg:flex-nowrap md:flex-nowrap xs:flex-wrap sm:flex-wrap ">
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Class Time Table
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Previout Year QP
                        </Button>
                        <Button
                          className="btn"
                          variant="contained"
                          sx={{ height: "120%", marginX: "auto" }}
                          fullWidth
                        >
                          Quizes
                        </Button>
                      </div>
                    </div>
                    {/* ACADEMIC ENDS HERE */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
