import mongoose from "mongoose";

const reqString = { type: String, required: true };

const assignmentSchema = new mongoose.Schema(
  {
    assignmentName: reqString,
    subjectCode: reqString,
    semester: {
      type: String,
      enum: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
    },
    subjectShortName: reqString,
    section: reqString,
    fileName: reqString,
    filePath: reqString,
    open: { type: Boolean, default: true },
    department: reqString,
    submittedBy: [
      {
        studentId: String,
        studentName: String,
        studentUrn: String,
        assignment: {
          fileName: String,
          path: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
