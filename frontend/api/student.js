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
    console.log(data);
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

export async function getTimeTableAPI(semester, section, department) {
  try {
    const response = await axios({
      headers,
      url:
        studentUrl +
        `/get-time-table?semester=${semester}&section=${section}&department=${department}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getAllAssignmentsAPI(semester, section, department) {
  try {
    const response = await axios({
      headers,
      method: "GET",
      url:
        studentUrl +
        `/get-all-assignments?semester=${semester}&section=${section}&department=${department}`,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function uploadAssignmentAPI(formdata) {
  try {
    const response = await axios({
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      url: studentUrl + "/upload-assignment",
      data: formdata,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function downloadAssignmentAPI(assignmentId, assignmentName) {
  try {
    const response = await axios({
      responseType: "blob",
      headers: { ...headers },
      url: studentUrl + `/download-assignment?assignmentId=${assignmentId}`,
      method: "GET",
    });

    // const res=await axios({})

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = assignmentName; // Filename for the downloaded file
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);

    // return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
}

// this is testing for the git
