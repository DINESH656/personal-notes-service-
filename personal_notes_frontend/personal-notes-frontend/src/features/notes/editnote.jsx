import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { getNoteById, updateNote } from "./notes.service";
const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setError('');
        const response = await getNoteById(id);
        const note = response.data.note;
        setFormData({
          title: note.title,
          content: note.category,
          category: note.category,
        });
      } catch (error) {
        setError(error.response?.data?.message || 'failed to load note ');
      }
    };
    fetchNote();
  }, [id]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    try {
      await updateNote(id, formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'failed to update the note ');
    }
  };

  return(
    <div>
      <Navbar/>
      <div className="page-container">
        <h2>EDIT NOTE </h2>
        <form className="form-card" onSubmit={handleSubmit}>
          <input 
          type = 'text'
          name = 'title'
          placeholder="Title"
          value = {formData.title}
          onChange={handleChange}
          />
          <input 
          type = 'text'
          name = 'category'
          placeholder="Category "
          value={formData.category}
          onChange={handleChange}
          />
          <textarea
          name = 'content'
          placeholder="write your note..."
          rows = '8'
          value={formData.content}
          onChange={handleChange}
          />
          <button type = 'submit'>UPDATE NOTE</button>

        </form>
        {error && <p className="error-text"> {error} </p>}
      </div>
    </div>
  );
};
export default EditNote;