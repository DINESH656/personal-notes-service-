import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiSave, FiTag, FiTrash2, FiX } from "react-icons/fi";
import Navbar from "../../components/NavBar";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/loader";
import { createTag, deleteTag, getTags, updateTag } from "./tags.service";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTags();
      setTags(response || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!tagName.trim()) return;

    try {
      setSaving(true);
      await createTag(tagName);
      setTagName("");
      toast.success("Tag created");
      await loadTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tag");
    } finally {
      setSaving(false);
    }
  };

  const handleEditStart = (tag) => {
    setEditingTagId(tag.tag_id);
    setEditingTagName(tag.tag_name);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingTagName.trim() || !editingTagId) return;

    try {
      setSaving(true);
      await updateTag(editingTagId, editingTagName);
      setEditingTagId(null);
      setEditingTagName("");
      toast.success("Tag updated");
      await loadTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tag");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tagId) => {
    try {
      await deleteTag(tagId);
      toast.success("Tag deleted");
      await loadTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete tag");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="form-page-header">
          <span className="page-icon">
            <FiTag />
          </span>
          <div>
            <h2>Tags</h2>
            <p>Create and organize reusable labels for your notes.</p>
          </div>
        </div>

        <form className="tag-form" onSubmit={handleCreate}>
          <input
            type="text"
            value={tagName}
            onChange={(event) => setTagName(event.target.value)}
            placeholder="New tag name"
            maxLength={50}
          />
          <button className="primary-btn" type="submit" disabled={saving}>
            <FiPlus />
            Add Tag
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <Loader title="Loading Tags..." message="Please wait." />
        ) : tags.length === 0 ? (
          <EmptyState
            title="No Tags Yet"
            description="Add your first tag to group related notes."
          />
        ) : (
          <div className="tag-list">
            {tags.map((tag) => (
              <div className="tag-row" key={tag.tag_id}>
                {editingTagId === tag.tag_id ? (
                  <form className="tag-edit-form" onSubmit={handleUpdate}>
                    <input
                      type="text"
                      value={editingTagName}
                      onChange={(event) => setEditingTagName(event.target.value)}
                      maxLength={50}
                    />
                    <button className="primary-btn" type="submit" disabled={saving}>
                      <FiSave />
                      Save
                    </button>
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => setEditingTagId(null)}
                    >
                      <FiX />
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="tag-pill">{tag.tag_name}</span>
                    <div className="tag-actions">
                      <button
                        className="secondary-btn"
                        type="button"
                        onClick={() => handleEditStart(tag)}
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                      <button
                        className="danger-btn"
                        type="button"
                        onClick={() => handleDelete(tag.tag_id)}
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;
