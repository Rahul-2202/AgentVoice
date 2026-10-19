// Budget, expenses and settle-up (PRD 6.5, 7.4). All money is integer minor
// units (paise for INR) so splits never drift on float rounding.

// Split an amount equally across members. The remainder goes one unit at a
// time to the first members in sorted order, so the same input always gives
// the same split and the shares add up exactly to the amount.
export function splitEqual(amountMinor, memberIds) {
  if (!Number.isInteger(amountMinor) || amountMinor < 0) {
    throw new Error('amount must be a non-negative integer in minor units');
  }
  const ids = [...new Set(memberIds)].sort();
  if (ids.length === 0) throw new Error('an expense needs at least one participant');
  const base = Math.floor(amountMinor / ids.length);
  const remainder = amountMinor - base * ids.length;
  return Object.fromEntries(ids.map((id, i) => [id, base + (i < remainder ? 1 : 0)]));
}

// Shares for one expense: explicit shares if given, otherwise an equal split.
// Explicit shares must add up to the expense amount exactly.
export function expenseShares(expense) {
  if (expense.shares) {
    const total = Object.values(expense.shares).reduce((a, b) => a + b, 0);
    if (total !== expense.amountMinor) {
      throw new Error(`shares for ${expense.id} add up to ${total}, not ${expense.amountMinor}`);
    }
    return { ...expense.shares };
  }
  return splitEqual(expense.amountMinor, expense.participants);
}

// Net position per member: positive means they are owed money, negative means
// they owe. Built from who paid and who owes each share.
export function computeBalances(expenses) {
  const net = {};
  for (const expense of expenses) {
    net[expense.paidBy] = (net[expense.paidBy] ?? 0) + expense.amountMinor;
    for (const [memberId, share] of Object.entries(expenseShares(expense))) {
      net[memberId] = (net[memberId] ?? 0) - share;
    }
  }
  return net;
}

// Who owes whom, with the fewest transfers. Each debt names the payer (the
// person being paid, `to`) and the amount.
export function settleUp(expenses) {
  const net = computeBalances(expenses);
  const creditors = [];
  const debtors = [];
  for (const [memberId, amount] of Object.entries(net)) {
    if (amount > 0) creditors.push({ memberId, amount });
    if (amount < 0) debtors.push({ memberId, amount: -amount });
  }
  // Largest first, then by id, so the output is stable.
  const byAmount = (a, b) => b.amount - a.amount || a.memberId.localeCompare(b.memberId);
  creditors.sort(byAmount);
  debtors.sort(byAmount);

  const debts = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    debts.push({ from: debtors[i].memberId, to: creditors[j].memberId, amountMinor: pay });
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount === 0) i += 1;
    if (creditors[j].amount === 0) j += 1;
  }
  return debts;
}

// Totals and categories across all expenses.
export function summarise(expenses) {
  const byCategory = {};
  let totalMinor = 0;
  for (const expense of expenses) {
    totalMinor += expense.amountMinor;
    const key = expense.category ?? 'other';
    byCategory[key] = (byCategory[key] ?? 0) + expense.amountMinor;
  }
  return { totalMinor, byCategory };
}

// The receipt total must equal the sum of expenses recorded against it.
export function reconcileReceipt(receipt, expenses) {
  const recorded = expenses
    .filter((e) => e.receiptId === receipt.id)
    .reduce((sum, e) => sum + e.amountMinor, 0);
  const difference = receipt.totalMinor - recorded;
  return { matches: difference === 0, expectedMinor: receipt.totalMinor, recordedMinor: recorded, differenceMinor: difference };
}

// UPI payback link for one debt. The payer must have a UPI ID on file;
// otherwise there is no link and the caller shows the debt without one.
export function upiPaybackLink(debt, payee) {
  if (!payee?.upiId) return null;
  const amount = (debt.amountMinor / 100).toFixed(2);
  const params = new URLSearchParams({
    pa: payee.upiId,
    pn: payee.name ?? payee.upiId,
    am: amount,
    cu: 'INR',
    tn: 'Go trip settle-up',
  });
  return `upi://pay?${params.toString()}`;
}

export function formatINR(minor) {
  return `₹${(minor / 100).toFixed(2)}`;
}
