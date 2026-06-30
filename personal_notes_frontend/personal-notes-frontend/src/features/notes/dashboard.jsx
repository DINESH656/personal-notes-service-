import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/NavBar";
import NoteCard from "./notecard";
import SearchBar from "../../components/searchBar";
import Pagination from "../../components/Pagination";
import Loader from "../../components/loader";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";

import {
  getNotes,
  deleteNote,
} from "./notes.service";

const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const [confirmDeleteNote, setConfirmDeleteNote] = useState(null);

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
    sortBy: "newest",
    title: "",
    category: "",
    keyword: "",
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const loadNotes = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotes(currentFilters);

      setNotes(response.notes || []);

      setPagination(
        response.pagination ?? {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load notes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes(filters);
  }, [filters, loadNotes]);

  const handleDelete = async () => {
    if (!confirmDeleteNote) return;

    try {
      setDeletingNoteId(confirmDeleteNote);

      await deleteNote(confirmDeleteNote);

      setConfirmDeleteNote(null);

      await loadNotes(filters);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete note."
      );
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "newest",
      title: "",
      category: "",
      keyword: "",
    });
  };

  return (
    <div>

      <Navbar />

      <div className="page-container">

        <div className="dashboard-hero">

          <div>
            <h1>
              {user?.full_name
                ? `Welcome back, ${user.full_name}`
                : "My Notes"}
            </h1>

            <p>
              Organize your knowledge,
              search your notes,
              and keep everything in one place.
            </p>
          </div>

          <div className="dashboard-summary">

            <div className="summary-card">

              <div className="summary-icon blue">
                📝
              </div>

              <div>
                <span>Total Notes</span>
                <strong>{pagination.total}</strong>
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-icon green">
                📄
              </div>

              <div>
                <span>Showing</span>
                <strong>{notes.length}</strong>
              </div>

            </div>

            <button
              className="primary-btn create-note-btn"
              onClick={() =>
                navigate("/notes/create")
              }
            >
              ＋ Create Note
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

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

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
          <Loader
            title="Loading Notes..."
            message="Please wait while we fetch your notes."
          />
        ) : notes.length > 0 ? (

          <div className="notes-grid">

            {notes.map((note) => (
              <NoteCard
                key={note.note_id}
                note={note}
                onDelete={setConfirmDeleteNote}
                deletingNoteId={deletingNoteId}
              />
            ))}

          </div>

        ) : (

          <EmptyState
            title="No Notes Found"
            description="Create your first note to start building your knowledge base."
            buttonText="Create First Note"
            onButtonClick={() =>
              navigate("/notes/create")
            }
          />

        )}

      </div>

      <ConfirmDialog
        isOpen={Boolean(confirmDeleteNote)}
        title="Delete Note"
        message="Are you sure you want to delete this note? You can restore it later from the Trash."
        confirmText="Delete"
        loading={Boolean(deletingNoteId)}
        onConfirm={handleDelete}
        onCancel={() =>
          setConfirmDeleteNote(null)
        }
      />

    </div>
  );
};

export default Dashboard;