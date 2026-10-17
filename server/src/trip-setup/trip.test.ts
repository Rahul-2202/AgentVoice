import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTrip, isIsoDate, missingSteps, nextStep, validateDraft, type TripDraft } from './trip.ts';

const TODAY = '2026-10-17';

const complete: TripDraft = {
  destination: 'Goa',
  startDate: '2026-12-12',
  endDate: '2026-12-15',
  groupSize: 4,
  budget: { min: 20000, max: 30000 },
  vibe: 'chill',
  stay: 'villa',
};

test('six taps in order: where, when, who, budget, vibe, stay', () => {
  assert.equal(nextStep({}), 'where');
  assert.equal(nextStep({ destination: 'Goa' }), 'when');
  assert.equal(nextStep({ ...complete, vibe: undefined, stay: undefined }), 'vibe');
  assert.deepEqual(missingSteps({}), ['where', 'when', 'who', 'budget', 'vibe', 'stay']);
  assert.equal(nextStep(complete), null);
});

test('a complete draft builds a trip with every required field', () => {
  assert.deepEqual(buildTrip(complete, TODAY), complete);
});

test('building an incomplete trip lists what is missing', () => {
  assert.throws(() => buildTrip({ destination: 'Goa' }, TODAY), /missing: when, who, budget, vibe, stay/);
});

test('dates must be real calendar dates', () => {
  assert.equal(isIsoDate('2026-02-29'), false);
  assert.equal(isIsoDate('2028-02-29'), true);
  assert.equal(isIsoDate('12 march'), false);
});

test('end date before start date is rejected', () => {
  assert.deepEqual(validateDraft({ ...complete, endDate: '2026-12-10' }, TODAY), [
    'when: end date is before start date',
  ]);
});

test('start date in the past is rejected', () => {
  assert.deepEqual(validateDraft({ ...complete, startDate: '2026-10-01', endDate: '2026-10-05' }, TODAY), [
    'when: start date is in the past',
  ]);
});

test('group size must be a whole number of at least one', () => {
  assert.equal(validateDraft({ groupSize: 0 }, TODAY).length, 1);
  assert.equal(validateDraft({ groupSize: 2.5 }, TODAY).length, 1);
});

test('budget max must not be below min', () => {
  assert.equal(validateDraft({ budget: { min: 30000, max: 20000 } }, TODAY).length, 1);
});

test('invalid draft is refused by buildTrip', () => {
  assert.throws(() => buildTrip({ ...complete, groupSize: 0 }, TODAY), /invalid/);
});

test('destination is trimmed on build', () => {
  assert.equal(buildTrip({ ...complete, destination: '  Goa ' }, TODAY).destination, 'Goa');
});
