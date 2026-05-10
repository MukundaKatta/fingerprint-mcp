import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { fingerprint } from '../src/server.js';

test('sha256 hex of "hello world"', () => {
  assert.equal(
    fingerprint('hello world', 'sha256', 'hex'),
    'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
  );
});
test('sha256 base64 of "hello world"', () => {
  assert.equal(
    fingerprint('hello world', 'sha256', 'base64'),
    'uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=',
  );
});
test('md5 of "hello"', () => {
  assert.equal(fingerprint('hello', 'md5', 'hex'), '5d41402abc4b2a76b9719d911017c592');
});
test('sha1 of empty', () => {
  assert.equal(fingerprint('', 'sha1', 'hex'), 'da39a3ee5e6b4b0d3255bfef95601890afd80709');
});
test('same input + algo + encoding deterministic', () => {
  const a = fingerprint('lorem', 'sha256', 'hex');
  const b = fingerprint('lorem', 'sha256', 'hex');
  assert.equal(a, b);
});
test('base64url has no padding', () => {
  const r = fingerprint('any', 'sha256', 'base64url');
  assert.ok(!r.includes('='));
  assert.ok(!r.includes('+'));
});
