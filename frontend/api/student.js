import axios from "axios";

const studentUrl = "http://localhost:8000/api/v1/students";

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

export async function getStudentDetails(urn) {
  try {
    const response = await axios({
      headers,
      url: studentUrl + `/get-details?urn=${urn}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchStudentDetails(urn) {
  try {
    const response = await axios({
      headers,
      url: studentUrl + `/fetch-details?urn=${urn}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchStudentDetailsById(id) {
  try {
    const response = await axios({
      headers,
      url: studentUrl + `/fetch-details-by-id?id=${id}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function loginStudent(data) {
  try {
    const response = await axios({
      headers,
      url: studentUrl + "/login-student",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function saveStudentDetailsAPI(studentDetails, studentId) {
  try {
    const response = await axios({
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      url: studentUrl + `/save-details?studentId=${studentId}`,
      method: "PATCH",
      data: studentDetails,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchStudentDetailsAPI(studentId) {
  try {
    const response = await axios({
      headers,
      method: "GET",
      url: studentUrl + `/fetch-student-details?studentId=${studentId}`,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchStudentAttendanceAPI(studentId) {
  try {
    const response = await axios({
      headers,
      method: "GET",
      url: studentUrl + `/fetch-student-attendance?studentId=${studentId}`,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
