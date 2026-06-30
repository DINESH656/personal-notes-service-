import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckSquare, FiEdit3, FiSave } from "react-icons/fi";
import Navbar from "../../components/NavBar";
import { createNote } from "./notes.service";
import { assignTagsToNote, getTags } from "../tags/tags.service";

const CreateNote = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await getTags();
        setTags(response || []);
      } catch {
        setTags([]);
      }
    };

    loadTags();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTagToggle = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((selectedTagId) => selectedTagId !== tagId)
        : [...prev, tagId],
    );
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
      const note = await createNote(formData);
      if (selectedTagIds.length > 0) {
        await assignTagsToNote(note.note_id, selectedTagIds);
      }
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
          <span className="page-icon">
            <FiEdit3 />
          </span>
          <div>
            <h2>Create Note</h2>
            <p>Add a new note to your personal knowledge base.</p>
          </div>
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

          {tags.length > 0 && (
            <div className="tag-selector">
              <label>
                <FiCheckSquare />
                Tags
              </label>
              <div className="tag-checkbox-grid">
                {tags.map((tag) => (
                  <label className="tag-checkbox" key={tag.tag_id}>
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.tag_id)}
                      onChange={() => handleTagToggle(tag.tag_id)}
                    />
                    <span>{tag.tag_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}>
            <FiSave />
            {loading ? "Creating..." : "Create Note"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default CreateNote;
