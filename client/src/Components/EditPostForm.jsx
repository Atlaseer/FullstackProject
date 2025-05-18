import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import '../styles/EditPostForm.css';

const EditPostForm = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post.title);
  const [tags, setTags] = useState(post.tags?.join(', ') || '');
  const [categories, setCategories] = useState(post.categories?.join(', ') || '');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(post.coverImage);
  const [htmlContent, setHtmlContent] = useState(post.content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: post.content,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setCoverImage(null);
      setCoverImagePreview(post.coverImage);
    }
  };

  const handleSave = () => {
    const updatedPost = {
      ...post,
      title,
      content: editor.getHTML(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      categories: categories.split(',').map(cat => cat.trim()).filter(Boolean),
      coverImage,
    };
    onSave(updatedPost);
  };

  return (
    <div className="edit-post-form">
      <h3>Edit Post</h3>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
      <div className="edit-post-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditPostForm;
