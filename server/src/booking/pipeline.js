// Booking pipeline (PRD 6.4). A booking runs only when all gates pass, in order:
//   1. the decision is closed and contains the offer
//   2. the payer typed "yes book" in the room
//   3. the payer approved the charge in the room
//   4. hard rules hold (cap, refundable, live check)
//   5. the payer's passkey confirmed on the vault page
// Only then does the simulated payment run and the connector book.
import { checkHardRules } from './rules.js';

export class BookingGateError extends Error {
  constructor(gate, message) {
    super(message);
    this.name = 'BookingGateError';
    this.gate = gate;
  }
}

const YES_BOOK = /^\s*yes,?\s+book\s*[.!]?\s*$/i;

export function isYesBook(text) {
  return YES_BOOK.test(text ?? '');
}

export async function bookOffer({
  decision,
  offer,
  payerId,
  message,
  approval,
  passkey,
  payment,
  connector,
  groupCap,
  travellers = 1,
  now = Date.now(),
}) {
  // Gate 1: a closed decision that includes this offer.
  if (!decision || decision.status !== 'closed') {
    throw new BookingGateError('closed_decision', 'booking needs a closed decision');
  }
  if (!decision.offerIds?.includes(offer.id)) {
    throw new BookingGateError('closed_decision', 'offer is not part of the closed decision');
  }

  // Gate 2: "yes book" from the payer only.
  if (message?.authorId !== payerId || !isYesBook(message?.text)) {
    throw new BookingGateError('yes_book', 'only the payer can say "yes book"');
  }

  // Gate 3: the payer approved this exact charge in the room.
  if (approval?.byId !== payerId || approval?.amount !== offer.price) {
    throw new BookingGateError('payer_approval', 'payer has not approved this charge');
  }

  // Gate 4: hard rules (throws BookingRuleError). Checked before the passkey
  // so the payer is never asked to confirm a charge that cannot go ahead.
  checkHardRules({ offer, groupCap, now });

  // Gate 5: passkey confirmation on the vault page, never in the app.
  const bookingKey = `${decision.id}:${offer.id}`;
  const confirmed = await passkey.confirm({ payerId, bookingKey, amount: offer.price });
  if (confirmed !== true) {
    throw new BookingGateError('passkey', 'passkey confirmation did not succeed');
  }

  const receipt = await payment.charge({ payerId, amount: offer.price, currency: offer.currency, bookingKey });
  const ticket = await connector.book({ offer, travellers });
  return { ticket: { ...ticket, paymentId: receipt.paymentId, payerId, paid: offer.price, label: 'DEMO' }, receipt };
}
