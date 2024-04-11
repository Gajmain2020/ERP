import mongoose from "mongoose";

const reqString = { type: String, required: true };

const pyqSchema = new mongoose.Schema(
  {
    session: reqString,
    department: reqString,
    examNames: reqString,
    semester: reqString,
    courseShortName: reqString,
    courseCode: reqString,
  },
  { timestamps: true }
);

export default mongoose.model("PYQ", pyqSchema);
