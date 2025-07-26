import { useState, useEffect } from 'react';
import { Note } from '../page';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
}

export default function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdateNote({ ...note, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdateNote({ ...note, content: newContent });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with title */}
      <div className="px-8 py-6 border-b border-gray-100">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-2xl font-semibold text-gray-900 border-none outline-none bg-transparent placeholder-gray-400"
          placeholder="Title"
        />
        <div className="text-xs text-gray-400 mt-2">
          Last modified: {note.lastModified.toLocaleString()}
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 px-8 py-6">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full border-none outline-none bg-transparent resize-none text-gray-800 placeholder-gray-400 leading-relaxed"
          placeholder="Start writing your note..."
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
        />
      </div>
    </div>
  );
} 