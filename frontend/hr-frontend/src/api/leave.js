import api from "./axios";

export const applyLeave = (data) => {
  return api.post("/leave/apply", data);
};

export const getLeaves = () => {
  return api.get("/leave/all");
};

export const updateLeave = (data) => {
  return api.put("/leave/update", data);
};