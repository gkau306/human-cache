import { useState, useEffect, useCallback } from 'react';
import { Note } from '../page';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => Promise<void>;
}

export default function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return async (updatedNote: Note) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          setIsSaving(true);
          try {
            await onUpdateNote(updatedNote);
          } finally {
            setIsSaving(false);
          }
        }, 500); // Wait 500ms after user stops typing
      };
    })(),
    [onUpdateNote]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedUpdate({ ...note, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedUpdate({ ...note, content: newContent });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with title */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-2xl font-semibold text-gray-900 border-none outline-none bg-transparent placeholder-gray-400"
            placeholder="Title"
          />
          {isSaving && (
            <div className="flex items-center text-sm text-gray-500 ml-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Saving...
            </div>
          )}
        </div>
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