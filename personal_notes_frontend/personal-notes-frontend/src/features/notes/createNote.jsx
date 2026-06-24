import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { createNote } from "./notes.service";

const CreateNote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',

  });
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNote(formData);
      navigate('/dashboard');
    }
    catch (error) {
      setError(error.response?.data?.message || 'failed to create note');
    }
  };
  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2>CREATE NOTE</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          <input
            type='text'
            name='title'
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            type='text'
            name='category'
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <textarea
            name='content'
            placeholder="write your note... "
            rows='8'
            value={formData.content}
            onChange={handleChange}
          />

          <button type='submit'>CREATE NOTE </button>
        </form>
        {error && <p className="error-text"> {error} </p>}
      </div>
    </div>
  );
};
export default CreateNote;