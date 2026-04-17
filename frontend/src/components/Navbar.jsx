import { Link } from "react-router-dom";
import { useContext } from "react";

import { LogOut, CheckSquare } from "lucide-react";
import { AuthContext } from "../../context/auth";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
  };
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <CheckSquare className="nav-icon" />
        <h2>Gattify</h2>
        <h1>{user?.name}</h1>
      </div>
      {user ? (
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link btn-primary">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
