# Notes App Backend API

This notes app now has a complete backend API that stores notes in a local JSON file.

## 🗂️ **File Structure**

```
src/
├── app/
│   ├── api/
│   │   └── notes/
│   │       ├── route.ts          # GET /api/notes, POST /api/notes
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE /api/notes/[id]
│   └── notes/
│       └── page.tsx              # Frontend (updated to use API)
├── lib/
│   └── api.ts                    # API utility functions
└── data/
    └── notes.json               # Local storage file (auto-created)
```

## 🔧 **API Endpoints**

### **GET /api/notes**
- **Purpose**: Get all notes
- **Response**: Array of note objects
- **Example**:
  ```json
  [
    {
      "id": "1703123456789",
      "title": "My Note",
      "content": "Note content...",
      "lastModified": "2023-12-21T10:30:45.123Z"
    }
  ]
  ```

### **POST /api/notes**
- **Purpose**: Create a new note
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: Created note object

### **GET /api/notes/[id]**
- **Purpose**: Get a specific note by ID
- **Response**: Single note object

### **PUT /api/notes/[id]**
- **Purpose**: Update a specific note
- **Body**: `{ "title": "string", "content": "string" }`
- **Response**: Updated note object

### **DELETE /api/notes/[id]**
- **Purpose**: Delete a specific note
- **Response**: `{ "message": "Note deleted successfully" }`

## 💾 **Data Storage**

- **Location**: `data/notes.json` (in project root)
- **Format**: JSON array of note objects
- **Auto-created**: Directory and file are created automatically
- **Git ignored**: The `data/` directory is in `.gitignore`

## 🚀 **How It Works**

### **1. File Operations**
```javascript
// Reading notes from file
const notes = await readNotes();

// Writing notes to file
await writeNotes(notes);
```

### **2. Data Persistence**
- Notes are stored as JSON in `data/notes.json`
- Each note has: `id`, `title`, `content`, `lastModified`
- File is automatically created if it doesn't exist

### **3. Frontend Integration**
```javascript
// Using the API functions
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api';

// Load notes
const notes = await fetchNotes();

// Create note
const newNote = await createNote('Title', 'Content');

// Update note
await updateNote(id, { title: 'New Title' });

// Delete note
await deleteNote(id);
```

## 🔄 **Real-time Updates**

The frontend now includes:
- **Loading states**: Shows spinner while fetching data
- **Error handling**: Displays error messages if API calls fail
- **Debounced saving**: Auto-saves notes 500ms after user stops typing
- **Optimistic updates**: UI updates immediately, syncs with backend

## 🛠️ **Development**

### **Starting the app**:
```bash
npm run dev
```

### **API testing**:
You can test the API endpoints using tools like:
- **Browser**: Visit `http://localhost:3000/api/notes`
- **Postman**: Send requests to the endpoints
- **curl**: Command line testing

### **Example curl commands**:
```bash
# Get all notes
curl http://localhost:3000/api/notes

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Hello World"}'

# Update a note
curl -X PUT http://localhost:3000/api/notes/1703123456789 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete a note
curl -X DELETE http://localhost:3000/api/notes/1703123456789
```

## 🔒 **Security Notes**

- This is a local file-based storage system
- No authentication or authorization
- Data is stored in plain JSON
- For production, consider using a proper database

## 🚀 **Next Steps**

To enhance this further, you could:
1. Add user authentication
2. Use a real database (PostgreSQL, MongoDB)
3. Add note categories/tags
4. Implement search functionality
5. Add file attachments
6. Add collaborative editing 