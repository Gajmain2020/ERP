import mongoose from "mongoose";

const timeTableMapSchema = new mongoose.Schema(
  {
    semester: String,
    department: String,
    section: String,
    timeTable: String,
  },
  { timestamps: true }
);

export default mongoose.model("Time Table Map", timeTableMapSchema);
