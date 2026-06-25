import axios from "axios";

const API = "http://localhost:5000/api/attendance";

// CHECK IN
export const checkIn = async () => {
  return await axios.post(
    `${API}/in`,
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
};

// CHECK OUT
export const checkOut = async () => {
  return await axios.post(
    `${API}/out`,
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
};

// GET USER STATUS
export const getMyStatus = async () => {
  return await axios.get(`${API}/me`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
};

// GET ALL ATTENDANCE
export const getAttendance = async () => {
  return await axios.get(`${API}/all`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
};