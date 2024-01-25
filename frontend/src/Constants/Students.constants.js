import StudentHomepage from "../Component/Student/StudentHomepage";
import TimeTable from "../Component/Student/TimeTable/TimeTable";
import AssesmentResults from "../Component/Student/AssesmentResults/AssesmentResults";
import Results from "../Component/Student/Results/Results";
import StudentAssignment from "../Component/Student/Assignment/Assignment";
import PYQ from "../Component/Student/PYQ/PYQ";
import StudentNotice from "../Component/Student/Notice/Notice";
import Events from "../Component/Student/Events/Events";
import StudentComplaints from "../Component/Student/Complaints/Complaints";
import Attendance from "../Component/Student/Attendance/Attendance";

class ValidationResult {
  constructor(valid, message) {
    this.valid = valid;
    this.message = message;
  }
}

const BloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const StateList = [
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
  "Jammu and Kashmir",
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

const INPUT_STYLE =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold";
const ALT_INPUT_STYLE =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-semibold";
const LABEL_STYLE =
  "block ml-1 text-sm font-medium text-gray-900 dark:text-white";

function isAnyFieldEmpty(studentDetails) {
  for (const key in studentDetails) {
    if (studentDetails[key] === "") {
      return false; // If any field is empty, return false
    }
  }
  return true; // All fields are filled, return true
}

function CHECK_DETAILS(studentDetails) {
  if (!isAnyFieldEmpty(studentDetails)) {
    return new ValidationResult(false, "All Fields Are Mandatory.");
  }
  if (studentDetails.admissionNumber.length !== 10) {
    return new ValidationResult(false, "Incorrect Admission Number.");
  }
  if (studentDetails.mobileNumber.length !== 10) {
    return new ValidationResult(false, "Incorrect Mobile Number.");
  }
  if (studentDetails.fatherMobileNumber.length !== 10) {
    return new ValidationResult(false, "Incorrect Father Mobile Number.");
  }
  if (studentDetails.motherMobileNumber.length !== 10) {
    return new ValidationResult(false, "Incorrect Mother Mobile Number.");
  }
  if (studentDetails.pinCode.length !== 6) {
    return new ValidationResult(false, "Incorrect Pincode.");
  }
  if (studentDetails.aadharNumber.length !== 12) {
    return new ValidationResult(false, "Incorrect Aadhar Number.");
  }

  return new ValidationResult(true);
}

export {
  CHECK_DETAILS,
  LABEL_STYLE,
  INPUT_STYLE,
  ALT_INPUT_STYLE,
  StudentHomepage,
  TimeTable,
  AssesmentResults,
  Results,
  StudentAssignment,
  PYQ,
  StudentNotice,
  Events,
  StudentComplaints,
  Attendance,
  BloodGroupOptions,
  StateList,
};
