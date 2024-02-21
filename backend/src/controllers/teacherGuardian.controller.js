import Teachers from "../models/teacher.model.js";
import TGs from "../models/teacherGuardian.model.js";
import Students from "../models/student.model.js";

function logOutError(error) {
  console.log("ERROR:::");
  console.log(error);
  console.log("______________________________________________");
  console.log(error.message);
}

export const fetchAllTG = async (req, res) => {
  try {
    const { department } = req.query;
    const tgs = await Teachers.find({
      department,
      isTG: true,
    }).select("-password");
    return res.status(200).json({
      message: "TGs sent successfully.",
      success: true,
      data: {
        tgs,
      },
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const assignTG = async (req, res) => {
  try {
    const { _id } = req.query;

    const teacherInDB = await Teachers.findById(_id);

    if (!teacherInDB) {
      return res.status(404).json({
        message: "Teacher with given ID is not found.",
        success: false,
      });
    }

    if (teacherInDB.isTG) {
      return res.status(409).json({
        success: false,
        message: "Given teacher is already a TG.",
      });
    }

    teacherInDB.isTG = true;
    await teacherInDB.save();

    await TGs.create({
      teacherId: teacherInDB._id,
      teacherName: teacherInDB.name,
      teacherEmpId: teacherInDB.empId,
    });
    return res.status(201).json({
      message: "Teacher is assigned as TG successfully.",
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const removeTG = async (req, res) => {
  try {
    const { _id } = req.query;

    const tgInDB = await TGs.findOne({
      teacherId: _id,
    });

    const students = tgInDB.studentsUnderTG;
    for (let i = 0; i < students.length; i++) {
      const studentInDB = await Students.findOne({ urn: students[i].urn });

      studentInDB.TG = "";
      await studentInDB.save();
    }

    const teacherInDB = await Teachers.findById(_id);
    teacherInDB.isTG = false;
    await teacherInDB.save();

    await TGs.findOneAndDelete({ teacherId: _id });
    return res.status(200).json({
      message: "TG removed successfully.",
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addSingleStudentTG = async (req, res) => {
  try {
    const { studentId } = req.body;
    const { teacherId } = req.query;
    let exists = false;

    const tgInDB = await TGs.findOne({
      teacherId,
    });
    const studentInDB = await Students.findById(studentId);

    if (
      studentInDB.TG !== "" &&
      studentInDB.TG !== `${tgInDB.teacherName}-${tgInDB.teacherEmpId}`
    ) {
      // student is already alloted to some tg
      const oldTGEmpId = studentInDB.TG.split("-")[1];
      const oldTGInDB = await TGs.findOne({
        teacherEmpId: oldTGEmpId,
      });

      const temp = oldTGInDB.studentsUnderTG;
      oldTGInDB.studentsUnderTG = [];
      oldTGInDB.studentsUnderTG = temp.filter((st) => st.id !== studentId);
      await oldTGInDB.save();
    }

    for (let i = 0; i < tgInDB.studentsUnderTG.length; i++) {
      if (tgInDB.studentsUnderTG[i].urn === studentInDB.urn) {
        exists = true;
      }
    }

    if (exists) {
      return res.status(409).json({
        message: "Student already exists under the TG.",
        success: false,
      });
    }

    tgInDB.studentsUnderTG.push({
      urn: studentInDB.urn,
      id: studentInDB._id,
      name: studentInDB.name,
      semester: studentInDB.semester,
      section: studentInDB.section,
    });

    studentInDB.TG = tgInDB.teacherName + "-" + tgInDB.teacherEmpId;

    await studentInDB.save();
    await tgInDB.save();

    return res.status(201).json({
      message: "Student added under TG successfully.",
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const addMultipleStudentTG = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const { students } = req.body;
    let assigned = 0;
    let notAssigned = 0;

    const tgInDB = await TGs.findOne({
      teacherId,
    });

    for (let i = 0; i < students.length; i++) {
      const studentInDB = await Students.findById(students[i].studentId);
      let exists = false;
      if (
        studentInDB.TG !== "" &&
        studentInDB.TG !== `${tgInDB.teacherName}-${tgInDB.teacherEmpId}`
      ) {
        // student is already alloted to some tg
        const oldTGEmpId = studentInDB.TG.split("-")[1];
        const oldTGInDB = await TGs.findOne({
          teacherEmpId: oldTGEmpId,
        });

        const temp = oldTGInDB.studentsUnderTG;
        oldTGInDB.studentsUnderTG = [];
        oldTGInDB.studentsUnderTG = temp.filter(
          (st) => st.id !== students[i].studentId
        );
        await oldTGInDB.save();
      }

      for (let i = 0; i < tgInDB.studentsUnderTG.length; i++) {
        if (tgInDB.studentsUnderTG[i].urn === studentInDB.urn) {
          exists = true;
        }
      }

      if (exists) {
        notAssigned++; // Already assigined to the TG
        continue;
      }

      tgInDB.studentsUnderTG.push({
        urn: studentInDB.urn,
        id: studentInDB._id,
        name: studentInDB.name,
        semester: studentInDB.semester,
        section: studentInDB.section,
      });

      studentInDB.TG = tgInDB.teacherName + "-" + tgInDB.teacherEmpId;

      await studentInDB.save();
      await tgInDB.save();
      assigned++;
    }
    return res.status(201).json({
      message: `Out of ${students.length} students ${assigned} have been successfully assingned to TG and ${notAssigned} have some conflict.`,
      success: true,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};

export const fetchStudentsByTG = async (req, res) => {
  try {
    const { teacherId } = req.query;

    const tg = await TGs.findOne({
      teacherId,
    });
    if (!tg) {
      return res.status(404).json({
        message: "TG not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: `${tg.studentsUnderTG.length} students have been sent.`,
      success: true,
      students: tg.studentsUnderTG,
    });
  } catch (error) {
    logOutError(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      success: false,
    });
  }
};
