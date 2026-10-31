const assert = require('node:assert');
const test = require('node:test');

test('chat request handler responds with data', async () => {
  const { handleChatRequest } = require('../src/index.js');
  const req = new Request('https://example.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'hello', assistant: 'checkmaitrex' }),
  });

  const res = await handleChatRequest(req, {});
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.ok);
  assert.equal(data.assistant, 'CheckmaîtréX AI');
});

test('fen extraction works for simple valid FEN strings', async () => {
  const { extractFen } = require('../src/services/chess.js');
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  assert.equal(extractFen(fen), fen);
});
