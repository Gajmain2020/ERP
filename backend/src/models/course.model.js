import mongoose from "mongoose";

const reqString = { type: String, required: true };

const courseSchema = new mongoose.Schema({
  courseCode: reqString,
  courseName: reqString,
  courseShortName: reqString,
  semester: reqString,
  department: reqString,
  courseType: {
    type: String,
    enum: ["core", "elective", "open"],
    default: "core",
  },
  takenBy: [{ teacherName: String, teacherId: String }],
});

export default mongoose.model("Course", courseSchema);
