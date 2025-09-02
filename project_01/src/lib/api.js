import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

//login
export const loginCheck = (id, pw) =>
  api.post("/login", { userid: id, userpw: pw });
export const getUserPassword = (userId) =>
  api.get(`/api/users/user/${userId}/password`);

export const verifyPassword = (userId, password) =>
  api.post(`/api/users/user/${userId}/verify-password`, password, {
    headers: { "Content-Type": "text/plain" },
  });

// user
export const testuser = () => api.get("/api/users/user");
export const deleteUser = (userId) => api.delete(`/api/users/user/${userId}`);
export const updateUser = (userId, userData) =>
  api.put(`/api/users/user/${userId}`, userData);
export const rank = (rank) => api.get("/api/users/user", { params: { rank } });
export const getUserById = (userId) => api.get(`/api/users/user/${userId}`);

//department
export const getDepartment = () => api.get("/api/departments/part");

//asset
export const assetData = () => api.get("/api/asset");
