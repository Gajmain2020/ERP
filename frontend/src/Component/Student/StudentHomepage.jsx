/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Heading from "../Common/Heading";
import Wrapper from "../Common/Wrapper";
import ErrSuccSnackbar from "../Common/ErrSuccSnackbar";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import UPLOAD_IMAGE from "../../assets/upload.png";

import VisibilityIcon from "@mui/icons-material/Visibility";
import Fill from "@mui/icons-material/DriveFileRenameOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  ALT_INPUT_STYLE,
  BloodGroupOptions,
  CHECK_DETAILS,
  INPUT_STYLE,
  LABEL_STYLE,
  StateList,
} from "../../Constants/Students.constants";

const INITIAL_STUDENT_DETAILS = {
  admissionNumber: "",
  fatherName: "",
  motherName: "",
  fatherMobileNumber: "",
  motherMobileNumber: "",
  dob: "",
  mobileNumber: "",
  gender: "",
  bloodGroup: "",
  category: "",
  address: "",
  pinCode: "",
  state: "",
  aadharNumber: "",
  profilePhoto: "",
};

// eslint-disable-next-line react/prop-types
export default function StudentHomepage({ token }) {
  const navigate = useNavigate();
  const id = location.pathname.split("/")[3];

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(INITIAL_STUDENT_DETAILS);

  const [openDetailsBackdrop, setOpenDetailsBackdrop] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //! useEffect for getting teacher data from the token
  useEffect(() => {
    if (token) {
      setData(() => jwtDecode(token)._doc);
    }
  }, [token]);

  //! useEffect for time display and updation of it in every second
  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  function handleSubmitStudentDetails() {
    const check = CHECK_DETAILS(studentDetails);
    if (!check.valid) {
      setErrorMessage(check.message);
    }
    //make api call to store the data
    console.log("make api call to store the data");
  }

  //# till student data is not decoded show skeleton and wait for data to be decoded
  if (data === null) {
    return (
      <Wrapper>
        <div role="status" className="center animate-pulse">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[640px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[540px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[640px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-900 max-w-[540px] mb-2.5 mx-auto"></div>
          <div className="h-2.5 mx-auto bg-gray-900 rounded-full dark:bg-gray-900 max-w-[640px]"></div>
          <div className="flex items-center justify-center mt-4">
            <svg
              className="w-8 h-8 text-gray-200 dark:text-gray-900 me-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-900 me-3"></div>
            <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-900"></div>
          </div>

          <div className="flex justify-center mt-5 text-2xl font-main mx-auto">
            <span>Loading...</span>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading>Welcome Student</Heading>
      {/* TIME COMPONENT */}
      <div className="flex justify-end items-center ">
        <span className="border truncate flex gap-3 px-4 justify-center py-1 bg-gray-300/20 items-center w-[15vw] text-zinc-200 rounded-lg font-sub">
          <span>{date.toLocaleDateString()}</span>
          <span>{date.toLocaleTimeString()}</span>
        </span>
      </div>

      {/* WARNING COMPONENT */}
      {!data.detailsFilled && (
        <div className="bg-red-300/30 rounded-md px-5 font-main flex items-center gap-2">
          <ErrorOutlineIcon />
          <span className="text-lg items-center">
            <span className="font-semibold underline">Attention Required</span>:
            Incomplete Profile Details, your profile is incomplete need to fill
            the details as soon as possible. To showcase your information
            accurately, please fill in the missing details promptly.&nbsp;
            <span
              onClick={() => setOpenDetailsBackdrop(() => true)}
              className="cursor-pointer font-semibold"
            >
              Click here
            </span>{" "}
            and complete your profile with essential information.
          </span>
        </div>
      )}

      {/* Notice Component */}
      <div className="flex flex-col rounded-md overflow-hidden">
        <div className="font-semibold flex justify-between item-center bg-zinc-400 px-3 py-2 font-heading">
          <span className="my-auto">Latest Notice And Announcements</span>
          <buton
            onClick={() => navigate("notice", { relative: "path" })}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="bg-neutral-300 px-3 py-1 rounded-md font-sub font-light hover:bg-neutral-700 hover:text-neutral-200 active: transition-all cursor-pointer active:outline active:scale-[95%] outline-offset-1"
          >
            View All
          </buton>
        </div>
        <div className="bg-zinc-200/20 px-2 min-h-[15vh] py-2 ">
          Make Api call to get new notice and announcements
        </div>
      </div>

      {/* Details component */}
      <div className="flex flex-col gap-2">
        <span className="mx-auto xl:text-2xl lg:text-2xl font-heading font-semibold text-zinc-900">
          Details
        </span>
        <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 sm:grid-cols-1 bg-zinc-200/50 p-3 rounded-md text-lg">
          <div className="flex gap-2 ">
            <span className="font-semibold">Name:</span> {data.name}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Department:</span>{" "}
            {data.department}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">CRN:</span> {data.crn}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">URN:</span> {data.urn}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Semester:</span> {data.semester}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Section:</span> {data.section}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">TG:</span> {data.TG.split("-")[0]}
          </div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Verified:</span>{" "}
            {data.verified ? "Verified" : "Not Verified"}
          </div>
          <div></div>
          <div className="flex gap-2 ">
            <span className=" font-semibold">Details Filled:</span>{" "}
            {data.detailsFilled ? (
              <div
                onClick={() => alert("create a data showing  component")}
                className="flex justify-center gap-2 items-center cursor-pointer"
              >
                Filled
                <button>
                  <VisibilityIcon fontSize="small" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setOpenDetailsBackdrop(() => true)}
                className="flex justify-center gap-2 items-center cursor-pointer"
              >
                Not Filled
                <button>
                  <Fill fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <buton
            onClick={() => navigate("profile", { relative: "path" })}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="bg-neutral-300 px-3 py-1 rounded-md font-sub font-light hover:bg-neutral-700 hover:text-neutral-200 active: transition-all cursor-pointer active:outline active:scale-[95%] outline-offset-1"
          >
            Edit Profile
          </buton>
        </div>
      </div>

      {openDetailsBackdrop && (
        <BackdropComponent
          open={openDetailsBackdrop}
          setOpen={setOpenDetailsBackdrop}
          studentDetails={studentDetails}
          setStudentDetails={setStudentDetails}
          student={data}
          setErrorMessage={setErrorMessage}
          handleAddStudentDetails={handleSubmitStudentDetails}
        />
      )}
      {(errorMessage !== "" || successMessage !== "") && (
        <ErrSuccSnackbar
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </Wrapper>
  );
}

function BackdropComponent({
  setOpen,
  student,
  setErrorMessage,
  setStudentDetails,
  studentDetails,
  handleAddStudentDetails,
}) {
  function handleChange(e) {
    setStudentDetails((student) => ({
      ...student,
      [e.target.name]: e.target.value,
    }));
  }

  function handleImageUpload(e) {
    if (e.target.files[0].size > 5242880) {
      setErrorMessage("Image size is more than 5MB.");
      return;
    }
    setStudentDetails((student) => ({
      ...student,
      profilePhoto: e.target.files[0],
    }));
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100vh] backdrop-blur bg-gray-900/50">
      <div className="flex  justify-center items-center h-[100%]">
        <div className="bg-gray-100/40 overflow-auto lg:h-[90vh] md:h-[90vh] lg:w-4/5 md:3/4 sm:w-3/4 xs:w-5/6 xs:h-[90vh] sm:[80vh] rounded-md ">
          {/* CLOSE BUTTON */}
          <div className="flex items-between justify-end">
            <button
              onClick={() => {
                setOpen(() => false);
                setStudentDetails(() => INITIAL_STUDENT_DETAILS);
              }}
              className="mr-2 mt-2 flex items-between bg-gray-700/80 rounded-sm px-2 py-0.5"
            >
              <CloseIcon color="error" />
            </button>
          </div>
          <Heading>Fill Details 📝</Heading>
          {/* MAIN FORM FOR INPUT */}
          {/* FIXED DATAS */}
          <div className="px-2 mt-3 grid gap-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
            <div>
              <label htmlFor="urn" className={LABEL_STYLE}>
                URN
              </label>
              <input
                type="text"
                id="urn"
                name="urn"
                placeholder="112233445566"
                required
                disabled
                value={student.urn}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label htmlFor="crn" className={LABEL_STYLE}>
                CRN
              </label>
              <input
                type="text"
                id="crn"
                name="crn"
                placeholder="A-01"
                required
                disabled
                value={student.crn}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block ml-1 mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Jack Danial"
                required
                disabled
                value={student.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label htmlFor="TG" className={LABEL_STYLE}>
                TG
              </label>
              <input
                type="text"
                id="TG"
                name="TG"
                placeholder="TG NAME"
                required
                disabled
                value={student.TG !== "" ? student.TG : "TG not assigned"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label htmlFor="semester" className={LABEL_STYLE}>
                Semester
              </label>
              <input
                type="text"
                id="semester"
                name="semester"
                placeholder="semester"
                required
                disabled
                value={student.semester}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label htmlFor="department" className={LABEL_STYLE}>
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                placeholder="department"
                required
                disabled
                value={student.department}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 cursor-not-allowed font-semibold"
              />
            </div>
          </div>
          {/* DETAILS FILLING COMPONENT */}
          <div className="grid lg:grid-cols-4 md:grid-cols-4 xs:grid-cols-1 sm:grid-cols-1">
            <div className="mt-3 col-span-3 px-2 grid gap-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
              <div>
                <label htmlFor="admissionNumber" className={LABEL_STYLE}>
                  Admission Number
                </label>
                <input
                  type="text"
                  id="admissionNumber"
                  name="admissionNumber"
                  placeholder="Eg. 1010101010"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label htmlFor="dob" className={LABEL_STYLE}>
                  Date Of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label htmlFor="bloodGroup" className={LABEL_STYLE}>
                  Select Blood Group
                </label>
                <select
                  name="bloodGroup"
                  onChange={handleChange}
                  id="bloodGroup"
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Choose Blood Group
                  </option>

                  {BloodGroupOptions.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="gender" className={LABEL_STYLE}>
                  Select Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Choose Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className={LABEL_STYLE}>
                  Select Category
                </label>
                <select
                  onChange={handleChange}
                  name="category"
                  id="category"
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Choose Category
                  </option>
                  <option value="general">Gen.</option>
                  <option value="OBC">OBC</option>
                  <option value="ST">ST</option>
                  <option value="SC">SC</option>
                </select>
              </div>
              <div>
                <label htmlFor="mobileNumber" className={LABEL_STYLE}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="Eg. 9988990099"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label htmlFor="fatherName" className={LABEL_STYLE}>
                  Father Name
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    placeholder="Eg. Alpha Beta"
                    required
                    onChange={handleChange}
                    className={INPUT_STYLE}
                  />
                  <input
                    type="number"
                    name="fatherMobileNumber"
                    placeholder="Father Mobile Number"
                    required
                    onChange={handleChange}
                    className={ALT_INPUT_STYLE}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="motherName" className={LABEL_STYLE}>
                  Mother Name
                </label>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    placeholder="Eg. Beta Alpha"
                    required
                    onChange={handleChange}
                    className={INPUT_STYLE}
                  />
                  <input
                    type="number"
                    name="motherMobileNumber"
                    placeholder="Mother Mobile Number"
                    required
                    onChange={handleChange}
                    className={ALT_INPUT_STYLE}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="aadharNumber" className={LABEL_STYLE}>
                  Aadhar Number
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  placeholder="Eg. 123123123123"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label htmlFor="address" className={LABEL_STYLE}>
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Eg. Street 3D, Durg"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label htmlFor="state" className={LABEL_STYLE}>
                  Select State Or UT
                </label>
                <select
                  id="state"
                  name="state"
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option selected value="">
                    Choose State Or UT
                  </option>
                  {StateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pinCode" className={LABEL_STYLE}>
                  Pin Code
                </label>
                <input
                  type="number"
                  id="pincode"
                  name="pinCode"
                  placeholder="Eg. 100010"
                  required
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="flex w-full xs:flex-col aspect-square overflow-auto row-span-3 mt-2 px-2 items-center gap-2">
              <img
                src={
                  studentDetails.profilePhoto !== ""
                    ? URL.createObjectURL(studentDetails.profilePhoto)
                    : UPLOAD_IMAGE
                }
                className="lg:w-[12vw] md:w-[12vw]  xs:w-[40vw] aspect-square rounded-full p-1"
              />
              <div>
                <label className={LABEL_STYLE} htmlFor="file_input">
                  Upload file
                </label>
                <input
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                />
                <span className="text-xs leading-tight text-red-200">
                  * The image should be in 1:1 ratio. <br />* Image Should be in
                  .jpg, .jpeg, .png format. <br />* Image should not be larger
                  than 5MB.
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT DETAILS BUTTON */}
          <div className="flex justify-center  sm:my-5  xs:my-5">
            <button
              onClick={handleAddStudentDetails}
              className="border bg-gray-700/70 hover:text-gray-100 hover:bg-green-600/70 transition-colors  px-8 py-1 font-semibold rounded-md "
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
