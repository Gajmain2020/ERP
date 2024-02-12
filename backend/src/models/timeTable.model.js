import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema(
  {
    timeTable: [
      [
        {
          courseShortName: String,
          courseId: String,
          teacherName: String,
          teacherId: String,
          period: Number,
        },
      ],
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TimeTable", timeTableSchema);

// timeTable: {
//       monday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//       tuesday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//       wednesday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//       thursday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//       friday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//       saturday: [
//         {
//           period: Number,
//           courseShortName: String,
//           courseId: String,
//           teacher: {
//             teacherName: String,
//             teacherId: String,
//           },
//         },
//       ],
//     },
