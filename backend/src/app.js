import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";
import teacherGuardianRouter from "./routes/teacherGuardian.routes.js";
import timeTableRouter from "./routes/timeTable.routes.js";
import adminRouter from "./routes/admin.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/teacher-guardians", teacherGuardianRouter);
app.use("/api/v1/time-table", timeTableRouter);
app.use("/api/v1/admin", adminRouter);

// need to work on middleware as well for authentication and routes to work properly

// API end point example for the time begin
// http://localhost:8000/api/v1/users/register

export { app };
