import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { getNoteById, updateNote } from "./notes.service";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setError("");
        setPageLoading(true);

        const response = await getNoteById(id);
        const note = response.data.note;

        setFormData({
          title: note.title,
          content: note.content,
          category: note.category,
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load note");
      } finally {
        setPageLoading(false);
      }
    };

    fetchNote();
  }, [id]);

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
      setUpdateLoading(true);
      await updateNote(id, formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update note");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="form-page-header">
          <h2>Edit Note</h2>
          <p>Update your note details and save changes.</p>
        </div>

        {pageLoading ? (
          <div className="empty-state">
            <h3>Loading note...</h3>
            <p>Please wait while we fetch the note details.</p>
          </div>
        ) : (
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
              placeholder="Enter category"
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

            <button type="submit" disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Note"}
            </button>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default EditNote;