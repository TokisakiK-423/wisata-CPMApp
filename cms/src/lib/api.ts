import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // 🔥 WAJIB
});

export const setToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;