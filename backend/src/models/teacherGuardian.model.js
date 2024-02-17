import mongoose, { Schema } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const teacherGuardianSchema = new Schema(
  {
    teacherId: reqString,
    teacherEmpId: reqString,
    teacherName: reqString,

    studentsUnderTG: [
      {
        urn: String,
        studentId: String,
        name: String,
        semester: String,
        section: String,
        crn: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TG", teacherGuardianSchema);
