"use client"

import { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api';

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
      
      // Select the first note if none is selected and notes exist
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleUpdateNote = async (updatedNote: Note): Promise<void> => {
    try {
      const updated = await updateNote(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content
      });
      
      setNotes(notes.map(note => 
        note.id === updatedNote.id ? updated : note
      ));
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err; // Re-throw to let the editor know about the error
    }
  };

  const handleAddNote = async () => {
    try {
      setError(null);
      const newNote = await createNote('New Note', '');
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      const filteredNotes = notes.filter(note => note.id !== id);
      setNotes(filteredNotes);
      
      if (selectedNoteId === id && filteredNotes.length > 0) {
        setSelectedNoteId(filteredNotes[0].id);
      } else if (filteredNotes.length === 0) {
        setSelectedNoteId('');
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
            <button 
              onClick={handleAddNote}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
              title="New Note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
        
        {/* Notes List */}
        <div className="flex-1 overflow-hidden">
          <NoteList 
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 bg-white">
        {selectedNote ? (
          <NoteEditor 
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">Select a note to edit</p>
            <p className="text-sm mt-1">or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
} 