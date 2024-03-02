import axios from "axios";

const teacherUrl = "http://localhost:8000/api/v1/teachers";

const headers = {
  "content-type": "application/json",
  token:
    localStorage.getItem("authToken") &&
    localStorage?.getItem("authToken") !== ""
      ? `Bearer ${localStorage
          .getItem("authToken")
          .substring(1, localStorage.getItem("authToken").length - 1)}`
      : "",
};

export async function loginTeacher(data) {
  try {
    const response = await axios({
      headers,
      url: teacherUrl + "/login-teacher",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchStudentsByTGAPI(teacherId) {
  try {
    const response = await axios({
      headers,
      url: teacherUrl + `/fetch-student-tg?teacherId=${teacherId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function verifyMultipleStudents(data) {
  try {
    const response = await axios({
      headers,
      url: teacherUrl + "/validate-students",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function verifySingleStudent(data) {
  try {
    const response = await axios({
      headers,
      url: teacherUrl + "/validate-student",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchClassesForTeacher(id) {
  try {
    const response = await axios({
      headers,
      url: teacherUrl + `/fetch-classes?id=${id}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchStudentBySectionAndSemester(
  dept,
  section,
  semester
) {
  try {
    const response = await axios({
      headers,
      url:
        teacherUrl +
        `/fetch-students?dept=${dept}&semester=${semester}&section=${section}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchClassesAPI(teacherId, searchData) {
  try {
    const response = await axios({
      headers,
      url:
        teacherUrl +
        `/fetch-class?teacherId=${teacherId}&semester=${searchData.semester}&day=${searchData.day}&section=${searchData.section}&period=${searchData.period}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function downloadAttendanceCSVAPI(teacherId, searchData) {
  try {
    const response = await axios({
      // responseType: "blob",
      headers,
      url:
        teacherUrl +
        `/download-attendance-CSV?teacherId=${teacherId}&semester=${searchData.semester}&section=${searchData.section}&courseShortName=${searchData.courseShortName}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addAttendanceAPI(teacherId, students, searchData, cls) {
  try {
    const response = await axios({
      headers,
      url:
        teacherUrl +
        `/add-attendance?teacherId=${teacherId}&period=${searchData.period}&date=${searchData.date}&courseShortName=${cls}`,
      data: students,
      method: "PATCH",
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
