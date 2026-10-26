import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const guardApi = {
  getDashboard: () => API.get("/guard/dashboard"),

  verifyQR: (data) => API.post("/guard/verify-qr", { qr: data }),

  searchVisitor: (phone) =>
    API.get(`/visitors/search?phone=${phone}`),

  verifyVehicle: (number) =>
    API.get(`/vehicle/${number}`),

  approveVisitor: (id) =>
    API.post(`/visitor/${id}/approve`),

  rejectVisitor: (id) =>
    API.post(`/visitor/${id}/reject`),

  entryLogs: () =>
    API.get("/entries"),

  exitLogs: () =>
    API.get("/exits"),
  createVisitor: (data) => API.post("/visitors", data),
getVisitors: () => API.get("/visitors"),
getVisitor: (id) => API.get(`/visitor/${id}`),

recordEntry: (id) => API.post(`/visitor/${id}/entry`),
deleteVisitor: (id) => API.delete(`/visitors/${id}`),
};