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
    coursesTaken: {
      type: [
        {
          courseName: String,
          courseCode: String,
          semester: String,
        },
      ],
      default: [],
    },

    classesTaken: {
      type: [
        {
          courseShortName: String,
          courseId: String,
          semester: String,
          section: String,
          period: Number,
          dayOfWeek: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
