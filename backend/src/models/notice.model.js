import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const noticeSchema = new mongoose.Schema(
  {
    noticeNumber: reqString,
    noticeSubject: reqString,
    semester: {
      type: String,
      enum: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
    },
    filePath: reqString,
    fileName: reqString,
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
