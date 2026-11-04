'use strict';

const express = require('express');
const { currentUser } = require('./auth.js');
const { notesPage, notePage } = require('./views.js');

const router = express.Router();

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const notes = db
    .prepare('SELECT * FROM notes ORDER BY id DESC')
    .all();
  res.send(notesPage(notes, currentUser(req)));
});

router.post('/notes', (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).send('Sign in first.');

  const { title = '', body = '' } = req.body || {};
  if (!title.trim()) return res.status(400).send('A note needs a title.');

  req.app.locals.db
    .prepare('INSERT INTO notes (author, title, body) VALUES (?, ?, ?)')
    .run(user.username, title, body);
  res.redirect('/');
});

router.get('/notes/:id', (req, res) => {
  const note = req.app.locals.db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .get(Number(req.params.id));
  if (!note) return res.status(404).send('No such note.');
  res.send(notePage(note));
});

module.exports = router;
// JSON API: get all notes
router.get('/api/notes', (req, res) => {
  const notes = req.app.locals.db
    .prepare('SELECT * FROM notes ORDER BY id DESC')
    .all();

  res.json(notes);
});

// JSON API: get one note
router.get('/api/notes/:id', (req, res) => {
  const note = req.app.locals.db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .get(Number(req.params.id));

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});
//api/notes for post
router.post('/api/notes', (req, res) => {
  const { title, body } = req.body || {};

  if (!title || !body) {
    return res.status(400).json({
      error: 'title and body are required'
    });
  }

  const user = currentUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Sign in first.' });
  }

  const result = req.app.locals.db
    .prepare('INSERT INTO notes (author, title, body) VALUES (?, ?, ?)')
    .run(user.username, title, body);

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    title,
    body
  });
});
