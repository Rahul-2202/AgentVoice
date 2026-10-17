import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decideGoSpeaks, isAddressedToGo } from './speaking.ts';

test('Go stays quiet on ordinary chat', () => {
  assert.deepEqual(decideGoSpeaks({ kind: 'chat', text: 'pizza or biryani tonight?' }), { speak: false });
});

test('Go speaks when addressed with @Go in any case', () => {
  assert.deepEqual(decideGoSpeaks({ kind: 'chat', text: 'hey @go find trains' }), { speak: true, reason: 'addressed' });
  assert.deepEqual(decideGoSpeaks({ kind: 'chat', text: '@Go?' }), { speak: true, reason: 'addressed' });
});

test('@gopher and email addresses do not address Go', () => {
  assert.equal(isAddressedToGo('ping @gopher'), false);
  assert.equal(isAddressedToGo('mail me at a@go.com'), false);
});

test('Go speaks when a vote opens or closes', () => {
  assert.deepEqual(decideGoSpeaks({ kind: 'vote_opened' }), { speak: true, reason: 'vote' });
  assert.deepEqual(decideGoSpeaks({ kind: 'vote_closed' }), { speak: true, reason: 'vote' });
});

test('Go speaks for money and bookings', () => {
  assert.deepEqual(decideGoSpeaks({ kind: 'money' }), { speak: true, reason: 'money' });
  assert.deepEqual(decideGoSpeaks({ kind: 'booking' }), { speak: true, reason: 'booking' });
});
