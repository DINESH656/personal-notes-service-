import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { loginUser } from "./auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-logo">
          <FiBookOpen size={34} />
        </div>

        <h1>Personal Knowledge Base</h1>

        <p>
          Securely organize your notes, tags, activities and build your own
          digital knowledge workspace.
        </p>

        <ul>
          <li><FiCheckCircle /> Secure Authentication</li>
          <li><FiCheckCircle /> Smart Search</li>
          <li><FiCheckCircle /> Tag Management</li>
          <li><FiCheckCircle /> Activity Tracking</li>
        </ul>

      </div>

      <div className="auth-card">

        <h2>Welcome Back 👋</h2>

        <p>
          Login to continue managing your personal knowledge base.
        </p>

        <form className="form-card auth-form" onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;