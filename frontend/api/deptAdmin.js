import axios from "axios";

const URL = "http://localhost:3001/api/";
const URL_2 = "http://localhost:3001/api/department/";

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

export async function fetchDeptTeachers(dept) {
  try {
    const response = await axios({
      headers,
      url: URL + dept + "/fetch-teachers/" + dept,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchDeptTGs(dept) {
  try {
    const response = await axios({
      headers,
      url: URL + dept + "/fetch-tgs/" + dept,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchDeptStudents(dept) {
  try {
    const response = await axios({
      headers,
      url: URL + dept + "/fetch-students/" + dept,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function assignSingleTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "assign-single-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function removeSingleTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "remove-single-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function removeMultipleTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "remove-multiple-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function assignMultipleTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "assign-multiple-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function assignMultipleStudentsTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "assign-students-to-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function assignSingleStudentTG(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "assign-student-to-tg",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addSingleCourse(data) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + "add-course",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchCoursesByDept(dept) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + `fetch-courses?dept=${dept}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteSingleCourse(courseId) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + `delete-course?courseId=${courseId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function editSingleCourse(course) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + `edit-course`,
      method: "PATCH",
      data: course,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addTeacherToCourse(selectedStudents, course) {
  try {
    const response = await axios({
      headers,
      url: URL_2 + `add-teacher-to-course?courseId=${course._id}`,
      method: "PATCH",
      data: selectedStudents,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchTimeTableAdmin(data, dept) {
  try {
    const response = await axios({
      headers,
      method: "GET",
      url:
        URL_2 +
        `/get-time-table?section=${data.section}&semester=${data.semester}&department=${dept}`,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchCoursesByDeptAndSemester(semester, department) {
  try {
    const response = await axios({
      headers,
      method: "GET",
      url:
        URL_2 +
        `/get-courses-by-dept-semester?semester=${semester}&department=${department}`,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addTimeTable(searchData, timeTable, dept) {
  try {
    const response = await axios({
      headers,
      method: "POST",
      url:
        URL_2 +
        `/add-time-table?semester=${searchData.semester}&department=${dept}&section=${searchData.section}`,
      data: timeTable,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
