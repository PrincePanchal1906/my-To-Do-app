import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const API =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://my-to-do-app-mx82.onrender.com";
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API}/api/auth/register`,
        { name, email, password },
        { axios.default.withCredentials: true },
      );
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glassmorphism">
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to get started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
            />
          </div>
          <button type="submit" className="btn-primary full-width">
            Register
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
