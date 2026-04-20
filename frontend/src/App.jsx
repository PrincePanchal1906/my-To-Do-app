import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "../context/auth";

function App() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return null;
  const hideNavbarRoutes = ["/login", "register"];
  return (
    <>
      {user && !hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
