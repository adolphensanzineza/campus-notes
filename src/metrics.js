'use strict';

const express = require('express');

const startedAt = Date.now();
const counts = new Map();          // "method|path|status" -> n

function middleware(req, res, next) {
  res.on('finish', () => {
    const route = (req.route && req.route.path) || req.path || '/';
    const key = `${req.method}|${route}|${res.statusCode}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  next();
}

const router = express.Router();

router.get('/metrics', (req, res) => {
  const lines = [
    '# HELP campus_notes_uptime_seconds Seconds since the process started.',
    '# TYPE campus_notes_uptime_seconds gauge',
    `campus_notes_uptime_seconds ${((Date.now() - startedAt) / 1000).toFixed(0)}`,
    '# HELP campus_notes_requests_total Requests handled, by method, route and status.',
    '# TYPE campus_notes_requests_total counter',
  ];
  for (const [key, n] of counts) {
    const [method, route, status] = key.split('|');
    lines.push(`campus_notes_requests_total{method="${method}",route="${route}",status="${status}"} ${n}`);
  }
  res.type('text/plain; version=0.0.4').send(lines.join('\n') + '\n');
});

module.exports = { middleware, router };
