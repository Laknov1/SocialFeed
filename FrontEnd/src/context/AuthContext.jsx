import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (token) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log("Loaded user data:", parsedUser);
            setUser(parsedUser);
          }
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error loading user data:", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      const { token: newToken, user: userData } = response.data;
      console.log("Login response:", response.data);

      // Ensure user data is properly structured
      const userWithRole = {
        ...userData,
        role: userData.role || "USER", // Ensure role is always present
      };

      setToken(newToken);
      setUser(userWithRole);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          email,
          password,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (updatedUser) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${updatedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const freshUserData = response.data;
      console.log("Updated user data:", freshUserData);

      // Ensure role is preserved
      const userWithRole = {
        ...freshUserData,
        role: freshUserData.role || user?.role || "USER",
      };

      setUser(userWithRole);
      localStorage.setItem("user", JSON.stringify(userWithRole));
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
