import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../styles/Main.css';
import '../styles/TiptapEditor.css'; // Optional: custom styles for dark/light
import MenuBar from './MenuBar'

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [htmlContent, setHtmlContent] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/posts',
        {
          title,
          content: htmlContent,
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
        <div className="tiptap-editor-wrapper">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
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
