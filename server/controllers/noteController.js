const {v4} = require('uuid');
const notes = [];
let nextId = 1
module.exports = {
    getAllNotes: (req, res) => {
        console.log('All notes : ' , notes);
        res.json(notes);
    },
    getNoteById : (req, res) => {
        const id = parseInt(req.params.id);
        console.log('Fetching note by id:', id);
        const note = notes.find(n => n.id === id);
        console.log('Note found:', note);
        if (!note) {
            console.log('Note not found:', id);
            return res.status(404).json({ error: 'Note not found' });
        }
        console.log('Fetching Singular note:', note);
        res.json(note);
    },
    createNote : (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const note = {
            id: nextId++,
            title,
            content,
            createdAt: new Date()
        };
        notes.push(note);
        console.log('Note created:', note);
        res.status(201).json(note);
    },
    updateNote : (req, res) => {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex === -1) {
            console.log('Note not found for update:', id);
            return res.status(404).json({ error: 'Note not found' });
        }
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        notes[noteIndex] = {
            ...notes[noteIndex],
            title,
            content,
            updatedAt: new Date()
        };
        console.log('Note updated:', notes[noteIndex]);
        res.json(notes[noteIndex]);
    },
    deleteNote : (req, res) => {
        const id = parseInt(req.params.id);
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex === -1) {
            console.log('Note not found for deletion:', id);
            return res.status(404).json({ error: 'Note not found' });
        }
        const deletedNote = notes.splice(noteIndex, 1)[0];
        console.log('Note deleted:', deletedNote);
        res.json({ message: 'Note deleted successfully', note: deletedNote });
    }
}