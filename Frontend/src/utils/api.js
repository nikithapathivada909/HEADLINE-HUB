import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api" });

export const fetchNews = (category) => API.get(`/news?category=${category}`);
export const login = (credentials) => API.post("/auth/login", credentials);
export const createPost = (postData, token) =>
  API.post("/posts", postData, {
    headers: { Authorization: `Bearer ${token}` },
  });
