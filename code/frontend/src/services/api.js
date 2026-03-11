import axios from "axios";

const API = axios.create({ 
    baseURL: "http://localhost:3000" 
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
export const getItems = () => API.get("/api/items");

export default API;