import { useNavigate } from "react-router-dom";
const NoteCard = ({ note, onDelete }) => {
    const navigate = useNavigate();
    return (
        <div className='note-card'>
            <h3>{note.title}</h3>
            <p>
                <strong>CATEGORY:</strong> {note.category}
            </p>
            <p>{note.content} </p>
            <div className='note-actions'>
                <button onClick={() => navigate(`/notes/edit/${note.note_id}`)}>
                    EDIT
                </button>
                <button onClick={() => onDelete(note.note_id)}>DELETE</button>
            </div>
        </div>
    );
};
export default NoteCard;