import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheckSquare, FiEdit3, FiSave } from "react-icons/fi";
import Navbar from "../../components/NavBar";
import { getNoteById, updateNote } from "./notes.service";
import { assignTagsToNote, getTags } from "../tags/tags.service";

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
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setError("");
        setPageLoading(true);

        const [note, availableTags] = await Promise.all([
          getNoteById(id),
          getTags(),
        ]);

        setFormData({
          title: note.title,
          content: note.content,
          category: note.category,
        });
        setTags(availableTags || []);
        setSelectedTagIds((note.tags || []).map((tag) => tag.tag_id));
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
      setUpdateLoading(true);
      await updateNote(id, formData);
      await assignTagsToNote(id, selectedTagIds);
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
          <span className="page-icon">
            <FiEdit3 />
          </span>
          <div>
            <h2>Edit Note</h2>
            <p>Update your note details and save changes.</p>
          </div>
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

            <button type="submit" disabled={updateLoading}>
              <FiSave />
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
