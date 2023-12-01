import mongoose, { Schema } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const teacherSchema = Schema(
  {
    name: reqString,
    department: reqString,
    email: reqString,
    empId: reqString,
    password: reqString,
    phoneNumber: reqString,

    isTG: {
      type: Boolean,
      default: false,
    },
    subjectsTaken: {
      type: [
        {
          subjectName: String,
          subjectCode: String,
          semester: String,
        },
      ],
      default: [],
    },

    classesTaken: {
      type: [
        {
          subjectShortName: String,
          semester: String,
          section: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
