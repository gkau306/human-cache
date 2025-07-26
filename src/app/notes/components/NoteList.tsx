import { Note } from '../page';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NoteListProps) {
  const formatDate = (date: Date | string) => {
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return dateObj.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getPreviewText = (content: string) => {
    const cleanContent = content.replace(/\n/g, ' ').trim();
    return cleanContent.length > 60 ? cleanContent.substring(0, 60) + '...' : cleanContent;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">No notes yet</p>
          <p className="text-xs mt-1">Create your first note</p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`group relative px-6 py-4 cursor-pointer transition-colors duration-150 ${
              selectedNoteId === note.id 
                ? 'bg-blue-50 border-r-2 border-r-blue-500' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectNote(note.id)}
          >
            <div className="flex flex-col space-y-1">
              {/* Title */}
              <div className="flex items-start justify-between">
                <h3 className={`font-medium truncate pr-8 ${
                  selectedNoteId === note.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {note.title || 'Untitled Note'}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Preview */}
              {note.content && (
                <p className={`text-sm truncate ${
                  selectedNoteId === note.id ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {getPreviewText(note.content)}
                </p>
              )}
              
              {/* Date */}
              <p className={`text-xs ${
                selectedNoteId === note.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {formatDate(note.lastModified)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 