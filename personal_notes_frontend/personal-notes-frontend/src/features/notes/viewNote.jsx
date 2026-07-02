import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiActivity, FiArrowLeft, FiEdit3, FiTag } from "react-icons/fi";
import { Paperclip } from "lucide-react";

import Navbar from "../../components/NavBar";

import { getNoteById } from "./notes.service";
import { getActivities } from "../activities/activities.service";

import UploadAttachments from "../attachments/UploadAttachments";
import AttachmentsList from "../attachments/AttachmentsList";

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString();
};

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshAttachments, setRefreshAttachments] = useState(0);

  const fetchNoteData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [noteResponse, activityResponse] = await Promise.all([
        getNoteById(id),
        getActivities({
          noteId: id,
          limit: 10,
          sortBy: "newest",
        }),
      ]);

      setNote(noteResponse);
      setActivities(activityResponse.activities || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshAttachmentList = async () => {
    setRefreshAttachments((previous) => previous + 1);

    await fetchNoteData();
  };

  useEffect(() => {
    fetchNoteData();
  }, [fetchNoteData]);

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
                  <FiArrowLeft />
                  Back
                </button>

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate(`/notes/edit/${note.note_id}`)
                  }
                >
                  <FiEdit3 />
                  Edit Note
                </button>
              </div>
            </div>

            <div className="note-view-meta">
              <p>
                <strong>Created:</strong>{" "}
                {formatDate(note.created_at)}
              </p>

              <p>
                <strong>Updated:</strong>{" "}
                {formatDate(note.updated_at)}
              </p>
            </div>

            {note.tags?.length > 0 && (
              <div className="tag-chip-list view-tags">
                {note.tags.map((tag) => (
                  <span
                    className="tag-chip"
                    key={tag.tag_id}
                  >
                    <FiTag />
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            )}

            <div className="note-view-content">
              <h3>Content</h3>

              <p>{note.content}</p>
            </div>

            {/* ---------------- Attachments ---------------- */}

            <div className="attachment-panel">
              <h3>
                <Paperclip size={24} />
                Attachments
              </h3>

              <AttachmentsList
                noteId={note.note_id}
                refreshTrigger={refreshAttachments}
              />

              <UploadAttachments
                noteId={note.note_id}
                onUploadSuccess={refreshAttachmentList}
              />
            </div>

            {/* ---------------- Activity ---------------- */}

            <div className="activity-panel">
              <h3>
                <FiActivity />
                Activity
              </h3>

              {activities.length > 0 ? (
                <div className="activity-list">
                  {activities.map((activity) => (
                    <div
                      className="activity-item"
                      key={activity.activity_id}
                    >
                      <strong>{activity.action_type}</strong>

                      <span>
                        {activity.action_description}
                      </span>

                      <small>
                        {formatDate(activity.created_at)}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No activity recorded yet.</p>
              )}
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