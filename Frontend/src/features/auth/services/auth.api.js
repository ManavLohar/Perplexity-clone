import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
export async function login({ username, email, password }) {
  try {
    const response = await api.post("/login", { username, email, password });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
export async function logout() {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
