"use client"

import { useState } from 'react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: '1', 
      title: 'Welcome Note', 
      content: 'Welcome to your notes app!',
      lastModified: new Date()
    },
    { 
      id: '2', 
      title: 'Todo List', 
      content: '1. Buy groceries\n2. Call mom\n3. Finish project',
      lastModified: new Date(Date.now() - 86400000) // 1 day ago
    },
    { 
      id: '3', 
      title: 'Ideas', 
      content: 'Some random ideas for future projects...',
      lastModified: new Date(Date.now() - 172800000) // 2 days ago
    }
  ]);
  
  const [selectedNoteId, setSelectedNoteId] = useState<string>('1');

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const updateNote = (updatedNote: Note) => {
    const noteWithTimestamp = {
      ...updatedNote,
      lastModified: new Date()
    };
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? noteWithTimestamp : note
    ));
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastModified: new Date()
    };
    setNotes([newNote, ...notes]); // Add to beginning like Apple Notes
    setSelectedNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    if (selectedNoteId === id && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0].id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
            <button 
              onClick={addNote}
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
        </div>
        
        {/* Notes List */}
        <div className="flex-1 overflow-hidden">
          <NoteList 
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 bg-white">
        {selectedNote ? (
          <NoteEditor 
            note={selectedNote}
            onUpdateNote={updateNote}
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