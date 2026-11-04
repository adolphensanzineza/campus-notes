'use strict';

const express = require('express');

const router = express.Router();

// V6 -- there is no authorisation check on this route. Any visitor, signed in
// or not, can read every account and every password hash. Nothing dangerous is
// *called* here; the defect is a line that is absent, which is why static
// analysis cannot see it. Fixed on Day 4, driven by a test.
router.get('/admin/users', (req, res) => {
  const users = req.app.locals.db
    .prepare('SELECT id, username, password_hash, role FROM users ORDER BY id')
    .all();
  res.json(users);
});

module.exports = router;
