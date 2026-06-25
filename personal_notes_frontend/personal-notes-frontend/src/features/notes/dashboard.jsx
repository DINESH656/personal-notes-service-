import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import NoteCard from "./notecard";
import { getMyNotes, deleteNote, searchNotes } from "./notes.service";

const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const [search, setSearch] = useState({
    title: "",
    category: "",
    keyword: "",
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchNotes = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await getMyNotes();
      const fetchedNotes = response.data.notes || [];
      setNotes(fetchedNotes);
      setAllNotes(fetchedNotes);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) return;

    try {
      setDeletingNoteId(noteId);
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.note_id !== noteId));
      setAllNotes((prev) => prev.filter((note) => note.note_id !== noteId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleSearch = async () => {
    try {
      setError("");
      setSearchLoading(true);

      if (!search.title && !search.category && !search.keyword) {
        await fetchNotes();
        return;
      }

      const response = await searchNotes(search);
      setNotes(response.data.notes || []);
    } catch (error) {
      setError(error.response?.data?.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = async () => {
    setSearch({
      title: "",
      category: "",
      keyword: "",
    });
    await fetchNotes();
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="dashboard-hero">
          <div>
            <h1>{user?.name ? `Welcome back, ${user.name}` : "My Notes"}</h1>
            <p>
              Organize your knowledge, search your notes, and keep everything in
              one place.
            </p>
          </div>

          <div className="dashboard-summary">
            <div className="summary-card">
              <span>Total Notes</span>
              <strong>{allNotes.length}</strong>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/notes/create")}
            >
              + Create Note
            </button>
          </div>
        </div>

        <div className="search-card">
          <h3>Search Notes</h3>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title"
              value={search.title}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Search by category"
              value={search.category}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, category: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Search by keyword"
              value={search.keyword}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, keyword: e.target.value }))
              }
            />

            <button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? "Searching..." : "Search"}
            </button>

            <button className="secondary-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="notes-section-header">
          <h2>My Notes</h2>
          <p>{notes.length} note(s) found
            {notes.length !== allNotes.length ? ` out of ${allNotes.length}` : ''}
          </p>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading notes...</h3>
            <p>Please wait while we fetch your notes.</p>
          </div>
        ) : notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.note_id}
                note={note}
                onDelete={handleDelete}
                deletingNoteId={deletingNoteId}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No notes found</h3>
            <p>
              You don’t have any notes yet. Create your first note to get
              started.
            </p>
            <button
              className="primary-btn"
              onClick={() => navigate("/notes/create")}
            >
              Create First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;