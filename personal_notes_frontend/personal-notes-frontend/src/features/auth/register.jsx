import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { registerUser } from "./auth.service";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
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

    if (!formData.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      navigate("/login");

    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
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
          Create your free account and start organizing your notes,
          activities and knowledge in one secure place.
        </p>

        <ul>
          <li><FiCheckCircle /> Secure Authentication</li>
          <li><FiCheckCircle /> Smart Organization</li>
          <li><FiCheckCircle /> Powerful Search</li>
          <li><FiCheckCircle /> Cloud Ready</li>
        </ul>

      </div>

      <div className="auth-card">

        <h2>Create Account 🚀</h2>

        <p>
          Register to begin building your personal knowledge base.
        </p>

        <form className="form-card auth-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />

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
            placeholder="Password (Minimum 8 characters)"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
};

export default Register;