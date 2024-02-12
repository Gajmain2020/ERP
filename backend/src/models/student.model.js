import mongoose from "mongoose";

const reqString = { type: String, required: true };

const studentSchema = mongoose.Schema(
  {
    name: reqString,
    department: reqString,
    email: { ...reqString, lowercase: true },
    crn: String,
    urn: reqString,
    password: reqString,
    semester: String,
    section: String,
    TG: { type: String, default: "" },

    isDetailsFilled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
