import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import Navbar from "../src/components/Navbar";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-to-do-app-mx82.onrender.com";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/me`, {
          withCredentials: true,
        });

        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};
