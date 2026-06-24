import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import NoteCard from "./notecard";
import { getMyNotes, deleteNote, searchNotes } from "./notes.service";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({
    title: '',
    category: '',
    keyword: '',
  });
  const fetchNotes = async () => {
    try {
      setError('');
      const response = await getMyNotes();
      setNotes(response.data.notes);
    }
    catch (error) {
      ServerRouter(error.response?.data?.message || 'failed to fetch notes');
    }
  };
  useEffect(() => { fetchNotes() }, []);
  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.note_id !== noteId));
    }
    catch (error) {
      alert(error.response?.data?.message || 'failed to delete note');
    }
  };
  const handleSearch = async () => {
    try {
      setError('');
      if (!search.title && !search.category && !search.keyword) {
        fetchNotes();
        return;
      }
      const response = await searchNotes(search);
      setNotes(response.data.notes);
    }
    catch (error) {
      setError(error.response?.data?.message || 'search failed ');
    }
  };
  const handleReset = () => {
    setSearch({
      title: '',
      category: '',
      keyword: '',
    });
    fetchNotes();
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>My Notes</h2>
        <div className="search-bar">
          <input
            type='text'
            placeholder="search by title"
            value={search.title}
            onChange={(e) => setSearch((prev) => ({

              ...prev,
              title: e.target.value
            }))
            }
          />
          <input
            type='text'
            placeholder="search by category"
            value={search.category}
            onChange={(e) => setSearch((prev) => ({

              ...prev,
              category: e.target.value
            }))
            }
          />
          <input
            type='text'
            placeholder="search by keyword"
            value={search.keyword}
            onChange={(e) => setSearch((prev) => ({

              ...prev,
              keyword: e.target.value
            }))
            }
          />
          <button onClick={handleSearch}>SEARCH</button>
          <button onClick={handleReset}>RESET</button>
        </div>
        <div className="notes-grid">
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard key={note.note_id} note={note} onDelete={handleDelete} />
            ))
          ) : (
            <p>No Notes Found</p>
          )
          }
        </div>
      </div>
    </div>
  );

};
export default Dashboard;