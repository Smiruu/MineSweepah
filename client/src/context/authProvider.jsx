// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";


const AuthContext = createContext();

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // include cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccess] = useState();
  const [authReady, setAuthReady] = useState(false)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      setAuthReady(false);
      try {
        const response = await API.get("/api/auth/refresh", {withCredentials: true});
        setAccess(response.data.access_token);
      } catch (err) {
        setAccess(null);
      } finally {
        setAuthReady(true);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    
    if(!accessToken || !authReady) return;
    const getUser = async () => {
      setUserLoading(true);
      try {
        console.log("Checking user session...");
        const response = await API.get("/api/auth/user", {
          withCredentials: true,
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("User session found:", response.data.user);
        setUser(response.data.user);
        
      } catch (err) {
        console.log("No user logged in", err);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    getUser();
  }, [accessToken, authReady]);

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/api/auth/signup", { username, email, password });
      // Optionally auto-login after register
      const user = response.data.user;
      const access_token = response.data.access_token;

      setAccess(access_token);
      setUser(user);
      return;
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

    setUserLoading(true)
    try {
      const response = await API.post("/api/auth/login", { identifier, password });
      // after login, fetch user from backend
      
      const user = response.data.user;
      const access_token = response.data.access_token;

      setAccess(access_token);
      setUser(user);
      return 
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
      await API.post("/api/auth/logout");
      setUser(null);

    } catch (err) {
      setError(err.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userLoading,
        loading,
        error,
        register,
        login,
        logout,
        accessToken,
        authReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
