const {Router} = require('express');
const NotesController = require('../controllers/noteController');
const NoteRouter = Router();

NoteRouter.post('/notes', NotesController.createNote);
NoteRouter.get('/notes', NotesController.getAllNotes);
NoteRouter.get('/notes/:id', NotesController.getNoteById);
NoteRouter.put('/notes/:id', NotesController.updateNote);
NoteRouter.delete('/notes/:id', NotesController.deleteNote);




module.exports = NoteRouter;