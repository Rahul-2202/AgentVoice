import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSentence } from './sentence.ts';
import { missingSteps } from './trip.ts';

const TODAY = '2026-10-17';

test('a full sentence fills every step', () => {
  const draft = parseSentence('goa, 12-15 december, 4 of us, 20k-30k each, chill, villa', TODAY);
  assert.deepEqual(draft, {
    destination: 'Goa',
    startDate: '2026-12-12',
    endDate: '2026-12-15',
    groupSize: 4,
    budget: { min: 20000, max: 30000 },
    vibe: 'chill',
    stay: 'villa',
  });
  assert.deepEqual(missingSteps(draft), []);
});

test('"to <place>" reads the destination from a longer sentence', () => {
  const draft = parseSentence('trip to Manali 5-8 january for 3 people', TODAY);
  assert.equal(draft.destination, 'Manali');
  assert.equal(draft.groupSize, 3);
  assert.deepEqual([draft.startDate, draft.endDate], ['2027-01-05', '2027-01-08']);
});

test('dates across two months roll the end into the next year when needed', () => {
  const draft = parseSentence('goa 28 december - 3 january, 2 people', TODAY);
  assert.deepEqual([draft.startDate, draft.endDate], ['2026-12-28', '2027-01-03']);
});

test('a bare date range is not read as a budget', () => {
  const draft = parseSentence('goa 12-15 march', TODAY);
  assert.equal(draft.budget, undefined);
  assert.equal(draft.groupSize, undefined);
});

test('rupee budgets with commas and symbols are read as INR per person', () => {
  const draft = parseSentence('goa ₹15,000 to ₹25,000', TODAY);
  assert.deepEqual(draft.budget, { min: 15000, max: 25000 });
});

test('unreadable parts are left out, not guessed', () => {
  const draft = parseSentence('somewhere nice soon', TODAY);
  assert.equal(draft.startDate, undefined);
  assert.equal(draft.vibe, undefined);
  assert.equal(draft.stay, undefined);
  assert.ok(missingSteps(draft).includes('when'));
});

test('a sentence with no place still leaves "where" for a tap', () => {
  const draft = parseSentence('5 of us, chill, hostel', TODAY);
  assert.equal(draft.destination, undefined);
  assert.deepEqual(missingSteps(draft), ['where', 'when', 'budget']);
});
