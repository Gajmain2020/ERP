import axios from "axios";

const AdminUrl = "http://localhost:3001/api/admin";
const LibUrl = "http://localhost:3001/api/admin/library";
const academicUrl = "http://localhost:3001/api/admin/academics";

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

//! !!!!!!!!!! LIBRARY APIS OVER HERE !!!!!!
export async function addSingleBook(data) {
  try {
    const response = await axios({
      headers,
      url: LibUrl + "/add-single-book",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function addMultipleBooks(data) {
  try {
    const response = await axios({
      headers,
      url: LibUrl + "/add-multiple-books",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function getBookDetails(bookId) {
  try {
    const response = await axios({
      headers,
      url: LibUrl + "/get-book-details?bookId=" + bookId,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

//! Academic apis over here
export async function getDetailsOfStudent(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + `/get-details/${data.urn}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function addSingleStudent(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/add-single-student",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function addMultipleStudents(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/add-multiple-students",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function editSingleStudent(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/update-student",
      method: "PATCH",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function addSingleTeacher(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/add-single-teacher",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function addMultipleTeachers(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/add-multiple-teachers",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchAllStudents() {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/fetch-students",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function fetchAllTeachers(dept) {
  console.log(dept);
  try {
    const response = await axios({
      headers,
      url: academicUrl + `/fetch-teachers`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
export async function deleteSingleStudent(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + `/delete-student/${data.urn}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteMultipleStudents(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + `/delete-students`,
      method: "DELETE",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function editSingleTeacher(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/update-teacher",
      data,
      method: "PATCH",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteSingleTeacher(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + `/delete-teacher/${data.empId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteMultipleTeachers(data) {
  try {
    const response = await axios({
      headers,
      url: academicUrl + "/delete-teachers",
      method: "DELETE",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
