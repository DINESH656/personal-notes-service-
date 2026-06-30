import { useNavigate } from "react-router-dom";

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const truncateContent = (content, maxLength = 180) => {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength)}...More`;
};

const NoteCard = ({ note, onDelete, deletingNoteId }) => {
  const navigate = useNavigate();

  const isDeleting = deletingNoteId === note.note_id;

  const handleOpenNote = () => {
    navigate(`/notes/${note.note_id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/notes/edit/${note.note_id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note.note_id);
  };

  return (
    <div
      className="note-card clickable-note-card"
      onClick={handleOpenNote}
    >
      <div className="note-card-header">
        <div className="note-title-section">
          <span className="note-icon">📝</span>

          <h3>{note.title}</h3>
        </div>

        <span className="category-badge">
          {note.category}
        </span>
      </div>

      <p className="note-content-preview">
        {truncateContent(note.content)}
      </p>

      <div className="note-meta">
        <div>
          <strong>Created</strong>
          <span>{formatDate(note.created_at)}</span>
        </div>

        <div>
          <strong>Updated</strong>
          <span>{formatDate(note.updated_at)}</span>
        </div>
      </div>

      <div className="note-actions">
        <button
          className="secondary-btn"
          onClick={handleEdit}
        >
          ✏ Edit
        </button>

        <button
          className="danger-btn"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "🗑 Delete"}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;    