'use strict';

const express = require('express');
const path = require('node:path');

const router = express.Router();
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// V4 -- the query string is joined onto the public directory with no
// validation, so ../ escapes it. Combined with V3 this is a full compromise:
//   GET /download?file=../src/auth.js
// returns the file containing the signing secret. Fixed on Day 4.
router.get('/download', (req, res) => {
  const requested = String(req.query.file || '');
  if (!requested) return res.status(400).send('Name a file.');

  const target = path.join(PUBLIC_DIR, requested);
  res.sendFile(target, (err) => {
    if (err) res.status(404).send('No such file.');
  });
});

module.exports = router;
