'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const { md5 } = require('./db.js');
const { loginPage } = require('./views.js');

// V3 -- the signing secret is committed to the repository. Anyone who can read
// the source can mint a valid admin session. Fixed on Day 4.
const JWT_SECRET = 'campus-notes-dev-secret';

const router = express.Router();

router.get('/login', (req, res) => {
  res.send(loginPage(null));
});

router.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const db = req.app.locals.db;

  // V5 -- MD5, unsalted. See db.js.
  const hash = md5(password);

  // V1 -- BOTH the username and the password hash are concatenated into the
  // SQL, so the whole credential check lives inside the query string. A
  // username of
  //   ' OR '1'='1' --
  // comments the password condition out entirely and returns the first row in
  // the table, which is the administrator. This is an authentication bypass,
  // not merely an odd row selection. Fixed on Day 4.
  const row = db
    .prepare(
      `SELECT * FROM users WHERE username = '${username}' AND password_hash = '${hash}'`
    )
    .get();

  if (!row) {
    return res.status(401).send(loginPage('Incorrect username or password.'));
  }

  const token = jwt.sign({ username: row.username, role: row.role }, JWT_SECRET);
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax' });
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
});

function currentUser(req) {
  const token = req.cookies && req.cookies.session;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { router, currentUser, JWT_SECRET };
