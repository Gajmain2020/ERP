import mongoose from "mongoose";

const reqString = { type: String, required: true };

const studentDetailsSchema = mongoose.Schema(
  {
    studentId: reqString,
    studentUrn: reqString,

    //details are listed below
    dob: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    admissionNumber: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    studentMobileNumber: String,
    motherName: String,
    motherMobileNumber: String,
    fatherName: String,
    fatherMobileNumber: String,
    aadharNumber: String,
    category: {
      type: String,
      enum: ["Gen", "OBC", "ST", "SC"],
    },
    permanentAddress: String,
    profilePhoto: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student Detail", studentDetailsSchema);
