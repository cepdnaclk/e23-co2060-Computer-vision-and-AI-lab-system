import axios from "axios";

// Point this to your Express backend port (from your index.js / .env)
const API = axios.create({ 
    baseURL: "http://localhost:5000" 
});

// Automatically attach the JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// Authentication APIs
export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);

// Inventory APIs
export const getItems = () => API.get("/api/items");
export const createItem = (data) => API.post("/api/items", data);
export const deleteItem = (id) => API.delete(`/api/items/${id}`);

export default API;