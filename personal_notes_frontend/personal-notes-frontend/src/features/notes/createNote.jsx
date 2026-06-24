import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { createNote } from "./notes.service";

const CreateNote = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
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

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);
      await createNote(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="form-page-header">
          <h2>Create Note</h2>
          <p>Add a new note to your personal knowledge base.</p>
        </div>

        <form className="form-card note-form-card" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter note title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Enter category (e.g. Frontend, Backend, Database)"
            value={formData.category}
            onChange={handleChange}
          />

          <textarea
            name="content"
            placeholder="Write your note content here..."
            rows="10"
            value={formData.content}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Note"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default CreateNote;