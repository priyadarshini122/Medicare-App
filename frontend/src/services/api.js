import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Auth APIs
export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);

// 💊 Medication APIs
export const addMedication = (data) => API.post("/medications/add", data);
export const getMedications = (userId) => API.get(`/medications/${userId}`);
export const markAsTaken = (id) => API.put(`/medications/mark/${id}`);

// 📎 Upload Proof
export const uploadProof = (id, file) => {
  const formData = new FormData();
  formData.append("proof", file);

  return API.post(`/medications/upload/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
