import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { getNoteById } from "./notes.service";

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString();
};

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getNoteById(id);
        setNote(response.data.note);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  return (
    <div>
      <Navbar />

      <div className="page-container">
        {loading ? (
          <div className="empty-state">
            <h3>Loading note...</h3>
            <p>Please wait while we fetch the note details.</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Unable to load note</h3>
            <p>{error}</p>
            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        ) : note ? (
          <div className="note-view-card">
            <div className="note-view-header">
              <div>
                <h1>{note.title}</h1>
                <span className="category-badge">{note.category}</span>
              </div>

              <div className="note-view-actions">
                <button
                  className="secondary-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Back
                </button>

                <button
                  className="primary-btn"
                  onClick={() => navigate(`/notes/edit/${note.note_id}`)}
                >
                  Edit Note
                </button>
              </div>
            </div>

            <div className="note-view-meta">
              <p>
                <strong>Created:</strong> {formatDate(note.created_at)}
              </p>
              <p>
                <strong>Updated:</strong> {formatDate(note.updated_at)}
              </p>
            </div>

            <div className="note-view-content">
              <h3>Content</h3>
              <p>{note.content}</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>Note not found</h3>
            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNote;