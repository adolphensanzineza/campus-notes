'use strict';

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  try {
    req.app.locals.db.prepare('SELECT 1').get();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      error: err.message
    });
  }
});

module.exports = router;
