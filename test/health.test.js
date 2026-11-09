// test/health.test.js
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert');
process.env.DB_PATH = ':memory:';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret';
const { createApp } = require('../src/server.js');
let server, base;
before(async () => {
 server = createApp().listen(0);
 await new Promise((r) => server.once('listening', r));
 base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
test('/health reports ok when the database answers', async () => {
 const res = await fetch(`${base}/health`);
 assert.strictEqual(res.status, 200);
 assert.deepStrictEqual(await res.json(), { status: 'ok' });
});
