import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeIxigo } from '../src/connectors/fakeIxigo.js';
import { bookOffer, isYesBook, BookingGateError } from '../src/booking/pipeline.js';
import { BookingRuleError, checkHardRules } from '../src/booking/rules.js';
import { createSimulatedPayment } from '../src/booking/simulatedPayment.js';
import { createDenyingPasskey } from '../src/booking/passkey.js';
import { assertTravelMode } from '../src/config.js';

const T0 = Date.parse('2026-10-17T10:00:00Z');
const PAYER = 'member-ada';

function allowingPasskey() {
  return { async confirm() { return true; } };
}

async function setup({ now = T0, groupCap = 10000 } = {}) {
  const connector = createFakeIxigo({ now: () => now });
  const [offer] = await connector.search({ kind: 'flight', from: 'BLR', to: 'GOI', date: '2026-11-01', travellers: 2 });
  const decision = { id: 'dec-1', status: 'closed', offerIds: [offer.id] };
  const message = { authorId: PAYER, text: 'yes book' };
  const approval = { byId: PAYER, amount: offer.price };
  const payment = createSimulatedPayment();
  return { connector, offer, decision, message, approval, payment, groupCap, now };
}

function run(ctx, overrides = {}) {
  return bookOffer({
    decision: ctx.decision,
    offer: ctx.offer,
    payerId: PAYER,
    message: ctx.message,
    approval: ctx.approval,
    passkey: allowingPasskey(),
    payment: ctx.payment,
    connector: ctx.connector,
    groupCap: ctx.groupCap,
    travellers: 2,
    now: ctx.now,
    ...overrides,
  });
}

test('search stamps every offer with checkedAt and marks it refundable and DEMO', async () => {
  const connector = createFakeIxigo({ now: () => T0 });
  const offers = await connector.search({ kind: 'flight', from: 'BLR', to: 'GOI' });
  assert.ok(offers.length > 0);
  for (const o of offers) {
    assert.equal(o.checkedAt, new Date(T0).toISOString());
    assert.equal(o.refundable, true);
    assert.equal(o.demo, true);
  }
});

test('search rejects unknown kinds', async () => {
  const connector = createFakeIxigo();
  await assert.rejects(connector.search({ kind: 'train' }), /unsupported kind/);
});

test('happy path: closed decision, yes book, payer approval, passkey, then DEMO ticket', async () => {
  const ctx = await setup();
  const { ticket, receipt } = await run(ctx);
  assert.equal(ticket.status, 'BOOKED');
  assert.equal(ticket.label, 'DEMO');
  assert.match(ticket.ticketId, /^DEMO-/);
  assert.equal(ticket.paid, ctx.offer.price);
  assert.equal(receipt.moneyMoved, false);
  assert.equal(receipt.label, 'DEMO');
  assert.equal(ctx.payment.charges.length, 1);
});

test('gate 1: no booking without a closed decision', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { decision: { ...ctx.decision, status: 'open' } }), (e) => e instanceof BookingGateError && e.gate === 'closed_decision');
  assert.equal(ctx.payment.charges.length, 0);
});

test('gate 1: offer must belong to the closed decision', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { decision: { ...ctx.decision, offerIds: ['other'] } }), (e) => e.gate === 'closed_decision');
});

test('gate 2: a non-payer cannot say yes book', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { message: { authorId: 'member-bob', text: 'yes book' } }), (e) => e.gate === 'yes_book');
});

test('gate 2: anything other than "yes book" does not book', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { message: { authorId: PAYER, text: 'sounds good' } }), (e) => e.gate === 'yes_book');
});

test('gate 3: a missing or mismatched payer approval blocks payment', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { approval: undefined }), (e) => e.gate === 'payer_approval');
  await assert.rejects(run(ctx, { approval: { byId: PAYER, amount: 1 } }), (e) => e.gate === 'payer_approval');
  assert.equal(ctx.payment.charges.length, 0);
});

test('gate 4: a failed passkey blocks the charge and the booking', async () => {
  const ctx = await setup();
  const denied = createDenyingPasskey();
  await assert.rejects(run(ctx, { passkey: denied }), (e) => e.gate === 'passkey');
  assert.equal(ctx.payment.charges.length, 0);
});

test('gate 4: the passkey port receives the payer and booking key', async () => {
  const ctx = await setup();
  let seen;
  await run(ctx, { passkey: { async confirm(args) { seen = args; return true; } } });
  assert.deepEqual(seen, { payerId: PAYER, bookingKey: `dec-1:${ctx.offer.id}`, amount: ctx.offer.price });
});

test('rule: no spend above the group cap', async () => {
  const ctx = await setup({ groupCap: 1000 });
  await assert.rejects(run(ctx), (e) => e instanceof BookingRuleError && e.rule === 'group_cap');
  assert.equal(ctx.payment.charges.length, 0);
});

test('rule: a price with no checked-at timestamp is refused', () => {
  assert.throws(
    () => checkHardRules({ offer: { price: 100, refundable: true }, groupCap: 1000, now: T0 }),
    (e) => e.rule === 'checked_at',
  );
});

test('rule: a stale price must be checked again', () => {
  const offer = { price: 100, refundable: true, checkedAt: new Date(T0).toISOString() };
  assert.throws(
    () => checkHardRules({ offer, groupCap: 1000, now: T0 + 16 * 60 * 1000 }),
    (e) => e.rule === 'live_check',
  );
  assert.doesNotThrow(() => checkHardRules({ offer, groupCap: 1000, now: T0 + 14 * 60 * 1000 }));
});

test('rule: non-refundable options are refused by default', () => {
  const offer = { price: 100, refundable: false, checkedAt: new Date(T0).toISOString() };
  assert.throws(() => checkHardRules({ offer, groupCap: 1000, now: T0 }), (e) => e.rule === 'refundable');
});

test('rule: a stale price blocks the whole pipeline before the passkey and payment', async () => {
  const ctx = await setup();
  await assert.rejects(run(ctx, { now: T0 + 60 * 60 * 1000 }), (e) => e.rule === 'live_check');
  assert.equal(ctx.payment.charges.length, 0);
});

test('isYesBook accepts the phrase and small variations only', () => {
  assert.equal(isYesBook('yes book'), true);
  assert.equal(isYesBook('Yes, book!'), true);
  assert.equal(isYesBook('  YES BOOK  '), true);
  assert.equal(isYesBook('yes'), false);
  assert.equal(isYesBook('book it'), false);
  assert.equal(isYesBook(undefined), false);
});

test('travel mode: only fake_ixigo is allowed in V1', () => {
  assert.equal(assertTravelMode('fake_ixigo'), 'fake_ixigo');
  assert.throws(() => assertTravelMode('ixigo_web'), /not available in V1/);
});
