import mongoose from "mongoose";

//this model will be used to store the past records current records will be stored in the main student database only

const attendanceSchema = new mongoose.Schema({});

export default mongoose.model("Attendence", attendanceSchema);
