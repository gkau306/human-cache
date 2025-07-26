import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the Note interface
interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

// Path to the data file
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'notes.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read notes from file
async function readNotes(): Promise<Note[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const notes = JSON.parse(data);
    // Convert string dates back to Date objects
    return notes.map((note: any) => ({
      ...note,
      lastModified: new Date(note.lastModified)
    }));
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write notes to file
async function writeNotes(notes: Note[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(notes, null, 2));
}

// GET /api/notes/[id] - Get a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await readNotes();
    const note = notes.find(n => n.id === params.id);

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error reading note:', error);
    return NextResponse.json(
      { error: 'Failed to read note' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === params.id);

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Update the note
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title !== undefined ? title : notes[noteIndex].title,
      content: content !== undefined ? content : notes[noteIndex].content,
      lastModified: new Date()
    };

    await writeNotes(notes);

    return NextResponse.json(notes[noteIndex]);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === params.id);

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    const deletedNote = notes[noteIndex];
    notes.splice(noteIndex, 1);
    await writeNotes(notes);

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 