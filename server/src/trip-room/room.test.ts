import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addMember, createRoom, postMessage, react } from './room.ts';
import { decideGoSpeaks } from './speaking.ts';

const base = () => createRoom('trip-1', ['asha', 'ben']);

test('members can post and Go stays quiet on plain chat', () => {
  const room = base();
  const { message, goSpeaks } = postMessage(room, { id: 'm1', authorId: 'asha', text: 'goa in march?', sentAt: 1 });
  assert.equal(message.authorId, 'asha');
  assert.equal(room.messages.length, 1);
  assert.deepEqual(goSpeaks, { speak: false });
});

test('a message addressed to Go is flagged to speak', () => {
  const room = base();
  const { goSpeaks } = postMessage(room, { id: 'm1', authorId: 'ben', text: '@Go what is cheap?', sentAt: 1 });
  assert.deepEqual(goSpeaks, { speak: true, reason: 'addressed' });
});

test('non-members cannot post', () => {
  const room = base();
  assert.throws(() => postMessage(room, { id: 'm1', authorId: 'eve', text: 'hi', sentAt: 1 }), /not a member/);
  assert.equal(room.messages.length, 0);
});

test('replies must point at a message in the same room', () => {
  const room = base();
  postMessage(room, { id: 'm1', authorId: 'asha', text: 'hi', sentAt: 1 });
  postMessage(room, { id: 'm2', authorId: 'ben', text: 'hey', sentAt: 2, replyTo: 'm1' });
  assert.throws(
    () => postMessage(room, { id: 'm3', authorId: 'ben', text: 'x', sentAt: 3, replyTo: 'nope' }),
    /not in this room/,
  );
});

test('reactions are one per member per emoji', () => {
  const room = base();
  postMessage(room, { id: 'm1', authorId: 'asha', text: 'hi', sentAt: 1 });
  react(room, 'm1', 'ben', '👍');
  react(room, 'm1', 'ben', '👍');
  assert.deepEqual(room.messages[0].reactions, { '👍': ['ben'] });
});

test('late joiners can post after being added', () => {
  const room = base();
  addMember(room, 'cy');
  const { message } = postMessage(room, { id: 'm1', authorId: 'cy', text: 'landed', sentAt: 1 });
  assert.equal(message.authorId, 'cy');
});

test('vote and booking events make Go speak', () => {
  assert.deepEqual(decideGoSpeaks({ kind: 'vote_opened' }), { speak: true, reason: 'vote' });
  assert.deepEqual(decideGoSpeaks({ kind: 'booking' }), { speak: true, reason: 'booking' });
});
