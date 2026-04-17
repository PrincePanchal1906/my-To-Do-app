import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-to-do-app-mx82.onrender.com";
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/me`, {
          withCredentials: true,
        });

        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
