import { useNavigate } from "react-router-dom";
import { FiCalendar, FiEdit2, FiFileText, FiTag, FiTrash2 } from "react-icons/fi";

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const truncateContent = (content, maxLength = 180) => {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength)}...`;
};

const NoteCard = ({ note, onDelete, deletingNoteId }) => {
  const navigate = useNavigate();
  const isDeleting = deletingNoteId === note.note_id;

  const handleOpenNote = () => {
    navigate(`/notes/${note.note_id}`);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/notes/edit/${note.note_id}`);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(note.note_id);
  };

  return (
    <div className="note-card clickable-note-card" onClick={handleOpenNote}>
      <div className="note-card-header">
        <div className="note-title-section">
          <span className="note-icon">
            <FiFileText />
          </span>
          <h3>{note.title}</h3>
        </div>

        <span className="category-badge">
          <FiTag />
          {note.category}
        </span>
      </div>

      <p className="note-content-preview">{truncateContent(note.content)}</p>

      {note.tags?.length > 0 && (
        <div className="tag-chip-list">
          {note.tags.map((tag) => (
            <span className="tag-chip" key={tag.tag_id}>
              {tag.tag_name}
            </span>
          ))}
        </div>
      )}

      <div className="note-meta">
        <div>
          <strong>Created</strong>
          <span>
            <FiCalendar />
            {formatDate(note.created_at)}
          </span>
        </div>

        <div>
          <strong>Updated</strong>
          <span>
            <FiCalendar />
            {formatDate(note.updated_at)}
          </span>
        </div>
      </div>

      <div className="note-actions">
        <button className="secondary-btn" onClick={handleEdit}>
          <FiEdit2 />
          Edit
        </button>

        <button className="danger-btn" onClick={handleDelete} disabled={isDeleting}>
          <FiTrash2 />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
