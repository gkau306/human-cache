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

// GET /api/notes - Get all notes
export async function GET() {
  try {
    const notes = await readNotes();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    return NextResponse.json(
      { error: 'Failed to read notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Title or content is required' },
        { status: 400 }
      );
    }

    const notes = await readNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content: content || '',
      lastModified: new Date()
    };

    notes.unshift(newNote); // Add to beginning like Apple Notes
    await writeNotes(notes);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
} 