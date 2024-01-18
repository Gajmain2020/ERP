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
    submittedBy: [
      {
        studentId: String,
        studentName: String,
        urn: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
