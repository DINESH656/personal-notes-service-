import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArchive, FiHome, FiRefreshCw, FiTag } from "react-icons/fi";
import Navbar from "../../components/NavBar";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/searchBar";
import Loader from "../../components/loader";
import EmptyState from "../../components/EmptyState";
import { getDeletedNotes, restoreDeletedNote } from "./trash.service";
import { getTags } from "../tags/tags.service";

const defaultPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleString();
};

const Trash = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "newest",
    title: "",
    category: "",
    keyword: "",
    tag: "",
  });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringNoteId, setRestoringNoteId] = useState(null);

  const loadTrash = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError("");
      const response = await getDeletedNotes(currentFilters);
      setNotes(response.notes || []);
      setPagination(response.pagination || defaultPagination);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load trash");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrash(filters);
  }, [filters, loadTrash]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await getTags();
        setTags(response || []);
      } catch {
        setTags([]);
      }
    };

    loadTags();
  }, []);

  const handleRestore = async (noteId) => {
    try {
      setRestoringNoteId(noteId);
      await restoreDeletedNote(noteId);
      await loadTrash(filters);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to restore note");
    } finally {
      setRestoringNoteId(null);
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
      tag: "",
    });
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="form-page-header">
          <span className="page-icon">
            <FiArchive />
          </span>
          <div>
            <h2>Trash</h2>
            <p>Restore notes that were previously deleted.</p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <SearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
          tags={tags}
        />

        <Pagination
          pagination={pagination}
          filters={filters}
          setFilters={setFilters}
        />

        {loading ? (
          <Loader
            title="Loading Trash..."
            message="Please wait while we fetch deleted notes."
          />
        ) : notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => {
              const isRestoring = restoringNoteId === note.note_id;

              return (
                <div className="note-card" key={note.note_id}>
                  <div className="note-card-header">
                    <h3>{note.title}</h3>
                    <span className="category-badge">
                      <FiTag />
                      {note.category}
                    </span>
                  </div>

                  <p className="note-content-preview">{note.content}</p>

                  <div className="note-meta">
                    <span>Deleted: {formatDate(note.deleted_at)}</span>
                    <span>Updated: {formatDate(note.updated_at)}</span>
                  </div>

                  <div className="note-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => navigate("/dashboard")}
                    >
                      <FiHome />
                      Dashboard
                    </button>
                    <button
                      className="primary-btn"
                      disabled={isRestoring}
                      onClick={() => handleRestore(note.note_id)}
                    >
                      <FiRefreshCw />
                      {isRestoring ? "Restoring..." : "Restore"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Trash is Empty"
            description="Deleted notes will appear here."
            buttonText="Back to Dashboard"
            onButtonClick={() => navigate("/dashboard")}
          />
        )}
      </div>
    </div>
  );
};

export default Trash;
