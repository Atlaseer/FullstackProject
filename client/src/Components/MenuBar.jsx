const MenuBar = ({ editor }) => {
    if (!editor) return null;
  
    return (
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>
          • List
        </button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={!editor.isActive('heading') ? 'active' : ''}>
          Normal
        </button>
      </div>
    );
  };

  export default MenuBar;