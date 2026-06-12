import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { getMe, login, logout, register } from "../services/auth.api";
import toast from "react-hot-toast";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ username, email, password });
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed!"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ username, email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed!"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch user!"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      const data = await logout();
      dispatch(setUser(null));
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}
