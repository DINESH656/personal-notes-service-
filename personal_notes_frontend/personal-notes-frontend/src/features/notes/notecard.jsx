import { useNavigate } from "react-router-dom";

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString();
};

const NoteCard = ({ note, onDelete, deletingNoteId }) => {
  const navigate = useNavigate();

  const isDeleting = deletingNoteId === note.note_id;

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <span className="category-badge">{note.category}</span>
      </div>

      <p className="note-content">{note.content}</p>

      <div className="note-meta">
        <span>Created: {formatDate(note.created_at)}</span>
        <span>Updated: {formatDate(note.updated_at)}</span>
      </div>

      <div className="note-actions">
        <button
          className="secondary-btn"
          onClick={() => navigate(`/notes/edit/${note.note_id}`)}
        >
          Edit
        </button>

        <button
          className="danger-btn"
          onClick={() => onDelete(note.note_id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;