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
