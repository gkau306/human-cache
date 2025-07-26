import { Note } from '@/app/notes/page';

const API_BASE_URL = '/api/notes';

// Get all notes
export async function fetchNotes(): Promise<Note[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

// Create a new note
export async function createNote(title: string, content: string): Promise<Note> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

// Update a note
export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

// Delete a note
export async function deleteNote(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

// Get a specific note
export async function fetchNote(id: string): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
} 