import mongoose from "mongoose";

const reqString = { type: String, required: true };

const courseSchema = new mongoose.Schema(
  {
    courseCode: reqString,
    courseName: reqString,
    courseShortName: reqString,
    semester: {
      type: String,
      required: true,
      enum: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
    },
    department: reqString,
    courseType: {
      type: String,
      enum: ["core", "elective", "open"],
      default: "core",
    },
    takenBy: [{ teacherName: String, teacherId: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
