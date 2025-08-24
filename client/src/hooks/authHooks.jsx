import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Register
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/signup", { username, email, password });

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    console.log(identifier)
    try {
      const res = await API.post("/login", { identifier, password });

      
      if (res.data?.session?.access_token) {
        localStorage.setItem("access_token", res.data.session.access_token);
      }

      if (res.data?.session?.user) {
        setUser(res.data.session.user);
        localStorage.setItem("user", JSON.stringify(res.data.session.user));
      }

      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await API.post("/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    user,      
    loading,
    error,
  };
};
