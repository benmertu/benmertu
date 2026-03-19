'use strict';
const assert = require('assert');

// --- Unit under test: getOpenCmd ---
// Extracted from index.js so we can test without spawning a process.
function getOpenCmd(platform) {
  if (platform === 'win32') return 'start';
  if (platform === 'darwin') return 'open';
  return 'xdg-open';
}

// Tests
assert.strictEqual(getOpenCmd('win32'),  'start',    'Windows should use start');
assert.strictEqual(getOpenCmd('darwin'), 'open',     'macOS should use open');
assert.strictEqual(getOpenCmd('linux'),  'xdg-open', 'Linux should use xdg-open');
assert.strictEqual(getOpenCmd('freebsd'),'xdg-open', 'Unknown platform should fall back to xdg-open');

console.log('All tests passed.');
