import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';

const CreatePostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [categories, setCategories] = useState('');

    // const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const post = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            categories: categories.split(',').map(cat => cat.trim()).filter(Boolean),
            author: user?.username || 'anonymous',
        };

        navigate('/');
    }

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
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