import { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // LOAD USER
  const loadUser = async () => {

    try {

      const { data } = await API.get("/auth/me");

      setUser(data);

      // SAVE USER TO LOCAL STORAGE
      localStorage.setItem("user", JSON.stringify(data));

    } catch (error) {

      console.log(error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }

  }, []);

  // LOGIN
  const login = async (formData) => {

    const { data } = await API.post("/auth/login", formData);

    // STORE TOKEN
    localStorage.setItem("token", data.token);

    // STORE USER
    localStorage.setItem("user", JSON.stringify(data.user));

    // UPDATE STATE
    setUser(data.user);

    return data;
  };

  // REGISTER
  const register = async (formData) => {

    const { data } = await API.post("/auth/register", formData);

    return data;
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;