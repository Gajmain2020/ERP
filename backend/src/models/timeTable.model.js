import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema(
  {
    monday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
    tuesday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
    wednesday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
    thursday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
    friday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
    saturday: [
      {
        period: Number,
        courseShortName: String,
        courseId: String,
        teacher: {
          teacherName: String,
          teacherId: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TimeTable", timeTableSchema);
