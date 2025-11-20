import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/authContext';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/'; 

const HomePage = () => {
    const { user, authTokens, logoutUser } = useContext(AuthContext);
    
    // --- State Management ---
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    
    // State for the CREATE form
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteBody, setNewNoteBody] = useState(''); // ⬅️ Changed to BODY
    const [newNoteCategory, setNewNoteCategory] = useState('Personal'); // ⬅️ Added Category, set default
    
    // Available categories from your model
    const CATEGORIES = ['Bussiness', 'Personal', 'Important'];

    // State for the EDIT form
    const [editingNote, setEditingNote] = useState(null); 


    // --- 1. READ (GET) Function (No Change needed here) ---
    const getNotes = async () => {
        // ... (existing getNotes logic using GET /notes/ and auth header) ...
        if (!authTokens) return;

        try {
            const response = await axios.get(`${baseUrl}notes/`, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setNotes(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
            if (err.response && err.response.status === 401) {
                setError("Authentication failed or token expired. Logging out...");
                logoutUser();
            } else {
                setError("Failed to load notes. Check server connection.");
            }
        }
    };


    // --- 2. CREATE (POST) Function ---
    const createNote = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${baseUrl}notes/`, 
                { 
                    title: newNoteTitle, 
                    body: newNoteBody, // ⬅️ Must use 'body'
                    category: newNoteCategory // ⬅️ Must include 'category'
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                setNotes([response.data, ...notes]);
                setNewNoteTitle('');
                setNewNoteBody('');
                setNewNoteCategory('Personal'); // Reset to default
            }
        } catch (err) {
            console.error('Error creating note:', err.response ? err.response.data : err);
            alert('Failed to create note. See console for details.');
        }
    };

    // --- 3. UPDATE (PUT/PATCH) Function ---
    const updateNote = async (e) => {
        e.preventDefault();
        if (!editingNote) return;

        try {
            const url = `${baseUrl}notes/${editingNote.slug}/`;
            
            const response = await axios.patch(url,
                { 
                    title: editingNote.title, 
                    body: editingNote.body, // ⬅️ Must use 'body'
                    category: editingNote.category // ⬅️ Must include 'category'
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setNotes(notes.map(note => 
                    note.slug === editingNote.slug ? response.data : note
                ));
                setEditingNote(null); 
            }
        } catch (err) {
            console.error('Error updating note:', err.response ? err.response.data : err);
            alert('Failed to update note. See console for details.');
        }
    };
    
    // --- 4. DELETE (DELETE) Function (No Change needed here) ---
    const deleteNote = async (noteSlug) => {
        // ... (existing deleteNote logic) ...
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;

        try {
            const url = `${baseUrl}notes/${noteSlug}/`;
            await axios.delete(url, { headers: { 'Authorization': `Bearer ${authTokens.access}` } });
            setNotes(notes.filter(note => note.slug !== noteSlug));
        } catch (err) {
            console.error('Error deleting note:', err.response ? err.response.data : err);
            alert('Failed to delete note. See console for details.');
        }
    };

    useEffect(() => {
        if (authTokens) {
            getNotes();
        }
    }, [authTokens]); 


    // Helper to handle input changes for the editing form
    const handleEditChange = (e) => {
        setEditingNote({
            ...editingNote,
            [e.target.name]: e.target.value,
        });
    };

    // --- RENDER FUNCTION ---
    return (
        <div className="homepage-container">
            <h1>Welcome to your Note App!</h1>
            {user && <p>Hello, **{user.username}**! Manage your notes below.</p>}
            
            <hr />
            
            {error && <p style={{ color: 'red' }}>**Error:** {error}</p>}

            {/* --- CREATE Form --- */}
            <h2>✍️ Create New Note</h2>
            <form onSubmit={createNote}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={newNoteTitle} 
                    onChange={(e) => setNewNoteTitle(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Note Body" 
                    value={newNoteBody} // ⬅️ Changed to newNoteBody
                    onChange={(e) => setNewNoteBody(e.target.value)} // ⬅️ Changed setter
                    required 
                />
                <select 
                    value={newNoteCategory} // ⬅️ Added Category Select
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                    required
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button type="submit">Add Note</button>
            </form>

            <hr />

            {/* --- READ/LIST Notes --- */}
            <h2>📚 Your Notes ({notes.length})</h2>
            <div className="notes-list">
                {notes.map((note) => (
                    <div key={note.slug} className="note-card" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {editingNote && editingNote.slug === note.slug ? (
                            
                            // --- EDIT Form (Inline) ---
                            <form onSubmit={updateNote}>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={editingNote.title} 
                                    onChange={handleEditChange} 
                                    required 
                                />
                                <textarea 
                                    name="body" // ⬅️ Must use 'body'
                                    value={editingNote.body} // ⬅️ Must use 'body'
                                    onChange={handleEditChange} 
                                    required 
                                />
                                <select 
                                    name="category" // ⬅️ Added Category Select
                                    value={editingNote.category} 
                                    onChange={handleEditChange}
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingNote(null)}>Cancel</button>
                            </form>

                        ) : (
                            // --- DISPLAY Mode ---
                            <>
                                <h3>{note.title} (Category: {note.category})</h3>
                                <p>{note.body}</p> {/* ⬅️ Must use 'body' */}
                                <p style={{ fontSize: '0.8em', color: '#666' }}>Created: {new Date(note.created).toLocaleDateString()}</p>
                                
                                {/* --- Action Buttons --- */}
                                <button onClick={() => setEditingNote(note)}>Edit</button>
                                <button onClick={() => deleteNote(note.slug)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;