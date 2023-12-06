import axios from "axios";

export async function submitComplain(data) {
  try {
    const response = await axios({
      url: "http://localhost:3001/api/common/complain",
      method: "POST",
      data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
