import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import NoteCard from "./notecard";
import { getNotes, deleteNote, } from "./notes.service";
import SearchBar from "../../components/searchBar";
import Pagination from "../../components/Pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'newest',
    title: '',
    category: '',
    keyword: '',
  });


  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const loadNotes = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      const response = await getNotes(currentFilters);
      // `getNotes` returns `response.data.data` from the API service,
      // so the value returned by the service is the object with `notes` and `pagination`.
      setNotes(response.notes || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      setError(error.response?.data?.message || 'failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(filters);
  }, [filters]);

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) return;

    try {
      setDeletingNoteId(noteId);
      await deleteNote(noteId);
      await loadNotes(filters);
      alert(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleSearch = async () => {
    const updatedFilters = {
      ...filters,
      page: 1,
    };
    setFilters(updatedFilters);
    loadNotes(updatedFilters);
  };

  const handleReset = async () => {
    const resetFilters = {
      page: 1,
      limit: 10,
      sortBy: 'newest',
      title: '',
      category: '',
      keyword: '',
    };
    setFilters(resetFilters);
    loadNotes(resetFilters);
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="dashboard-hero">
          <div>
            <h1>
              {user?.full_name ? `Welcome back, ${user.full_name}` : "My Notes"}
            </h1>
            <p>
              Organize your knowledge, search your notes, and keep everything in
              one place.
            </p>
          </div>

          <div className="dashboard-summary">
            <div className="summary-card">
              <span>Total Notes</span>
              <strong>{pagination.total}</strong>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/notes/create")}
            >
              + Create Note
            </button>
          </div>
        </div>

        <SearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="notes-section-header">
          <h2>My Notes</h2>
          <p>
            {pagination.total} note(s) available
          </p>
        </div>
        <Pagination
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
        />

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
