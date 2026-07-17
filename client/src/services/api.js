import axios from "axios";

const api = axios.create({
  baseURL: "https://full-stack-assessment-fwgb.onrender.com",
});

export default api;