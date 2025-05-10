import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = ({ content, onChange }) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });
  
    return <EditorContent editor={editor} />;
  };
  
  export default TiptapEditor;