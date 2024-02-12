import axios from "axios";

const AdminUrl = "http://localhost:8000/api/v1/admin";

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

export async function loginAdmin(data) {
  try {
    const response = await axios({
      url: AdminUrl + "/login",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addCourseAPI(data) {
  try {
    const response = await axios({
      headers,
      url: AdminUrl + `/${data.department}/add-course`,
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchCoursesAPI(department) {
  try {
    const response = await axios({
      headers,
      url: AdminUrl + `/${department}/fetch-courses?department=${department}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchAllCoursesBySemesterAPI(semester, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/fetch-all-courses-by-semester?department=${department}&semester=${semester}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchAllCoursesAPI(department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl + `/${department}/fetch-all-courses?department=${department}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteCourseAPI(department, courseId) {
  try {
    const response = await axios({
      headers,
      url: AdminUrl + `/${department}/delete-course?courseId=${courseId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function searchTimeTableAPI(department, semester, section) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/search-time-table?section=${section}&semester=${semester}&department=${department}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function searchCourseAPI(courseCode, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/search-course?courseCode=${courseCode}&department=${department}`,
      methhod: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function searchTeacherAPI(teacherName, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/search-teacher?teacherName=${teacherName}&department=${department}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addTeacherToCourseAPI(teacher, course, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/add-teacher-to-course?courseCode=${course.courseCode}&teacherId=${teacher._id}`,
      method: "PATCH",
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function removeTeacherFromCourseAPI(teacher, course, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/remove-teacher-from-course?courseCode=${course.courseCode}&teacherId=${teacher._id}`,
      method: "PATCH",
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function saveTimeTableAPI(
  timeTable,
  semester,
  section,
  department
) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/save-time-table?semester=${semester}&section=${section}&department=${department}`,
      method: "POST",
      data: timeTable,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addMultipleStudentsAPI(students, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/add-multiple-students?department=${department}`,
      data: students,
      method: "POST",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function addSingleStudentAPI(student, department) {
  try {
    const response = await axios({
      headers,
      url:
        AdminUrl +
        `/${department}/add-single-students?department=${department}`,
      data: student,
      method: "POST",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
