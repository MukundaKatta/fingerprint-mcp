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
test('sha512 hex of "hello world"', () => {
  assert.equal(
    fingerprint('hello world', 'sha512', 'hex'),
    '309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f' +
      '989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f',
  );
});
test('different input yields different digest', () => {
  assert.notEqual(
    fingerprint('a', 'sha256', 'hex'),
    fingerprint('b', 'sha256', 'hex'),
  );
});
