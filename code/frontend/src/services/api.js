import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const initiateRegistration = (data) => API.post("/api/auth/register/initiate", data);
export const verifyRegistration = (data) => API.post("/api/auth/register/verify", data);
export const loginUser = (data) => API.post("/api/auth/login", data);

export const getItems = () => API.get("/api/items");
export const createItem = (data) => API.post("/api/items", data);
export const deleteItem = (id) => API.delete(`/api/items/${id}`);
export const updateItem = (id, data) => API.put(`/api/items/${id}`, data);

export const createBooking = (data) => API.post("/api/bookings", data);
export const getBookings = () => API.get("/api/bookings");
export const updateBookingStatus = (id, data) => API.put(`/api/bookings/${id}/status`, data);

export const getUsers = () => API.get("/api/users");
export const createUser = (data) => API.post("/api/users", data);
export const updateUser = (id, data) => API.put(`/api/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/api/users/${id}`);

export const getPeople = () => API.get("/api/people");
export const createPerson = (data) => API.post("/api/people", data);
export const updatePerson = (id, data) => API.put(`/api/people/${id}`, data);
export const deletePerson = (id) => API.delete(`/api/people/${id}`);

export const getNews = () => API.get("/api/news");
export const createNews = (data) => API.post("/api/news", data);
export const updateNews = (id, data) => API.put(`/api/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/api/news/${id}`);

export default API;
