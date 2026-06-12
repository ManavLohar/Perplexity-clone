import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  // baseURL: "http://localhost:3000/api/auth",
  baseURL: "https://perplexity-clone-d030vwp2a-manav-lohars-projects.vercel.app/api/auth",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", { username, email, password });
    toast("Please verify your email!", {
      icon: "ℹ️",
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    });
    return response.data;
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors && errors.length > 0) {
      errors.map((error) => toast.error(error.msg));
    } else {
      toast.error(error.response.data.message);
    }
  }
}

export async function login({ username, email, password }) {
  try {
    const response = await api.post("/login", { username, email, password });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
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
