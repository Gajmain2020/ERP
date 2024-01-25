import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema({
  monday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
  tuesday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
  wednesday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
  thursday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
  friday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
  saturday: [
    {
      period: Number,
      subjectShortName: String,
      teacher: {
        teacherName: String,
        teacherId: String,
      },
    },
  ],
});

export default mongoose.model("TimeTable", timeTableSchema);
