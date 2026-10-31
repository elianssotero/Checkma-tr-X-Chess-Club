const asserts = require('node:assert');
const test = require('node:test');

test('constants are defined', () => {
  const constants = require('../src/config/constants.js');
  assert.ok(constants.DEFAULT_ASSISTANT, 'Default assistant should be defined');
  assert.ok(constants.MAX_MESSAGE_LENGTH > 0, 'Message limit should be positive');
});

test('assistant config resolves to a known assistant', () => {
  const { getAssistantConfig } = require('../src/config/assistants.js');
  const config = getAssistantConfig('checkmaitrex');
  assert.equal(config.id, 'checkmaitrex');
  assert.equal(config.name, 'CheckmaîtréX AI');
});

test('validation rejects invalid body', () => {
  const { validateChatInput } = require('../src/utils/validation.js');
  const errors = validateChatInput({});
  assert.ok(errors.includes('Message is required'));
});
