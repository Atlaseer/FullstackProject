// client/src/Components/CreatePostForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../styles/TiptapEditor.css';
import MenuBar from './MenuBar';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
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

  // Handle cover image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setCoverImage(null);
      setCoverImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !htmlContent.trim()) {
      setError('Title and content are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', htmlContent);
      if (tags) {
        tags.split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .forEach(tag => formData.append('tags', tag));
      }
      if (categories) {
        categories.split(',')
          .map(cat => cat.trim())
          .filter(Boolean)
          .forEach(cat => formData.append('categories', cat));
      }
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const res = await axios.post(
        'http://localhost:3000/api/posts',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // navigate to the newly created post
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      console.error('Post creation failed:', err);
      setError(err.response?.data?.error || 'Failed to create post.');
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
          onChange={e => setTitle(e.target.value)}
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
          onChange={e => setTags(e.target.value)}
        />
      </label>

      <label>
        Categories (comma-separated):
        <input
          type="text"
          value={categories}
          onChange={e => setCategories(e.target.value)}
        />
      </label>

      <label>
        Cover Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      {coverImagePreview && (
        <div className="cover-preview">
          <p>Preview:</p>
          <img
            src={coverImagePreview}
            alt="Cover preview"
            className="cover-preview-image"
          />
        </div>
      )}

      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostForm;