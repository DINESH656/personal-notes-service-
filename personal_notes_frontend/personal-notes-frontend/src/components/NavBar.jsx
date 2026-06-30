import { NavLink, useNavigate } from "react-router-dom";
import {
  FiArchive,
  FiBookOpen,
  FiEdit3,
  FiGrid,
  FiLogOut,
  FiTag,
} from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand-mark">
          <FiBookOpen />
        </div>
        <div>
          <h2 className="brand-title">Knowledge Base</h2>
          <p className="brand-subtitle">
            {user?.full_name
              ? `Signed in as ${user.full_name}`
              : "Secure personal notes"}
          </p>
        </div>
      </div>

      <div className="nav-links">
        <NavLink to="/dashboard">
          <FiGrid />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/notes/create">
          <FiEdit3 />
          <span>Create</span>
        </NavLink>
        <NavLink to="/tags">
          <FiTag />
          <span>Tags</span>
        </NavLink>
        <NavLink to="/trash">
          <FiArchive />
          <span>Trash</span>
        </NavLink>
        <button onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
