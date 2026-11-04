'use strict';

const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'campus-notes.db');

// V5 -- passwords are hashed with MD5. MD5 is fast and unsalted, so a stolen
// table can be reversed with a wordlist in seconds. Fixed on Day 4.
function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'staff'
  );
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY,
    author     TEXT NOT NULL,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const USERS = [
  { username: 'admin',  password: 'admin123',   role: 'admin' },
  { username: 'mutesi', password: 'lab-week-3', role: 'staff' },
  { username: 'kamana', password: 'marking28',  role: 'staff' },
];

function open() {
  if (DB_PATH !== ':memory:') {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }
  const db = new DatabaseSync(DB_PATH);
  db.exec(SCHEMA);
  seedIfEmpty(db);
  return db;
}

// Seeding runs only when the tables are empty. This is what makes Activity 9
// honest: data written by a participant survives a container recreation,
// because a restart does not re-seed.
function seedIfEmpty(db) {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get();
  if (n > 0) return;

  const insertUser = db.prepare(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)'
  );
  for (const u of USERS) insertUser.run(u.username, md5(u.password), u.role);

  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'seed', 'notes.json'), 'utf8')
  );
  const insertNote = db.prepare(
    'INSERT INTO notes (author, title, body) VALUES (?, ?, ?)'
  );
  for (const note of notes) insertNote.run(note.author, note.title, note.body);
}

module.exports = { open, md5, DB_PATH };
