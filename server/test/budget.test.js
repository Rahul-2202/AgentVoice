import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  splitEqual,
  expenseShares,
  computeBalances,
  settleUp,
  summarise,
  reconcileReceipt,
  upiPaybackLink,
  formatINR,
} from '../src/budget/ledger.js';

const expenses = [
  { id: 'e1', receiptId: 'r1', paidBy: 'ada', amountMinor: 300000, category: 'stay', participants: ['ada', 'bo', 'cy'] },
  { id: 'e2', receiptId: 'r1', paidBy: 'bo', amountMinor: 90000, category: 'food', participants: ['ada', 'bo', 'cy'] },
  { id: 'e3', receiptId: 'r1', paidBy: 'cy', amountMinor: 60000, category: 'cab', shares: { ada: 10000, cy: 50000 } },
];

test('splitEqual gives exact shares, with the remainder going to the first members', () => {
  const shares = splitEqual(100, ['cy', 'ada', 'bo']);
  assert.deepEqual(shares, { ada: 34, bo: 33, cy: 33 });
  assert.equal(Object.values(shares).reduce((a, b) => a + b, 0), 100);
});

test('splitEqual rejects non-integer and empty input', () => {
  assert.throws(() => splitEqual(10.5, ['a']), /integer/);
  assert.throws(() => splitEqual(10, []), /participant/);
});

test('explicit shares must add up to the expense amount', () => {
  assert.throws(() => expenseShares({ id: 'x', amountMinor: 100, shares: { a: 60 } }), /add up/);
});

test('balances net to zero and show who is owed', () => {
  const net = computeBalances(expenses);
  assert.equal(Object.values(net).reduce((a, b) => a + b, 0), 0);
  assert.equal(net.ada, 300000 - (100000 + 30000 + 10000));
  assert.equal(net.bo, 90000 - (100000 + 30000));
  assert.equal(net.cy, 60000 - (100000 + 30000 + 50000));
});

test('settle-up gives the fewest transfers and each debt names payer and amount', () => {
  const debts = settleUp(expenses);
  const net = computeBalances(expenses);
  // Applying every debt to the balances must clear everyone.
  const after = { ...net };
  for (const d of debts) {
    assert.ok(d.amountMinor > 0);
    assert.notEqual(d.from, d.to);
    after[d.from] += d.amountMinor;
    after[d.to] -= d.amountMinor;
  }
  for (const v of Object.values(after)) assert.equal(v, 0);
  assert.ok(debts.length <= Object.keys(net).length - 1);
  for (const d of debts) {
    assert.equal(typeof d.to, 'string');
    assert.equal(typeof d.amountMinor, 'number');
  }
});

test('settle-up is stable across calls', () => {
  assert.deepEqual(settleUp(expenses), settleUp(expenses));
});

test('a two-person split gives one debt; a payer who covers only themselves gives none', () => {
  const even = [{ id: 'e', paidBy: 'a', amountMinor: 200, participants: ['a', 'b'] }];
  assert.deepEqual(settleUp(even), [{ from: 'b', to: 'a', amountMinor: 100 }]);
  assert.deepEqual(settleUp([{ id: 'z', paidBy: 'a', amountMinor: 500, participants: ['a'] }]), []);
});

test('summarise gives totals and categories', () => {
  const s = summarise(expenses);
  assert.equal(s.totalMinor, 450000);
  assert.deepEqual(s.byCategory, { stay: 300000, food: 90000, cab: 60000 });
});

test('receipt total must match the sum of recorded expenses', () => {
  const ok = reconcileReceipt({ id: 'r1', totalMinor: 450000 }, expenses);
  assert.equal(ok.matches, true);
  assert.equal(ok.recordedMinor, 450000);

  const off = reconcileReceipt({ id: 'r1', totalMinor: 460000 }, expenses);
  assert.equal(off.matches, false);
  assert.equal(off.differenceMinor, 10000);
});

test('expenses on another receipt do not count toward this receipt', () => {
  const r = reconcileReceipt({ id: 'r2', totalMinor: 0 }, expenses);
  assert.equal(r.matches, true);
  assert.equal(r.recordedMinor, 0);
});

test('UPI payback link carries payee, amount in rupees and INR', () => {
  const link = upiPaybackLink({ from: 'bo', to: 'ada', amountMinor: 123456 }, { name: 'Ada', upiId: 'ada@upi' });
  const url = new URL(link);
  assert.equal(url.protocol, 'upi:');
  assert.equal(url.searchParams.get('pa'), 'ada@upi');
  assert.equal(url.searchParams.get('pn'), 'Ada');
  assert.equal(url.searchParams.get('am'), '1234.56');
  assert.equal(url.searchParams.get('cu'), 'INR');
});

test('no UPI link when the payee has no UPI ID on file', () => {
  assert.equal(upiPaybackLink({ from: 'bo', to: 'ada', amountMinor: 100 }, { name: 'Ada' }), null);
});

test('formatINR shows rupees with paise', () => {
  assert.equal(formatINR(123456), '₹1234.56');
});
