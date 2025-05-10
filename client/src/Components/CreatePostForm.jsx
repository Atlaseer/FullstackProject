import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Main.css';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/posts',
        {
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          categories: categories.split(',').map(cat => cat.trim()).filter(Boolean)
        },
        { withCredentials: true }
      );

      navigate(`/post/${res.data._id}`);
    } catch (err) {
      console.error('Post creation failed:', err);
      setError('Failed to create post. Make sure you are logged in.');
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h2>Create New Post</h2>

      {error && <p className="txt-error">{error}</p>}

      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Content:
        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>

      <label>
        Tags (comma-separated):
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </label>

      <label>
        Categories (comma-separated):
        <input
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
      </label>

      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostForm;
