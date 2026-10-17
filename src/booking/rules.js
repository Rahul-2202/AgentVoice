// Hard booking rules from PRD section 7.9. Each check throws, so a rule
// breach can never fall through to a payment or a booking call.
import { PRICE_MAX_AGE_MS } from '../config.js';

export class BookingRuleError extends Error {
  constructor(rule, message) {
    super(message);
    this.name = 'BookingRuleError';
    this.rule = rule;
  }
}

export function checkHardRules({ offer, groupCap, now = Date.now() }) {
  if (!offer.checkedAt || Number.isNaN(Date.parse(offer.checkedAt))) {
    throw new BookingRuleError('checked_at', 'price has no checked-at timestamp');
  }
  if (now - Date.parse(offer.checkedAt) > PRICE_MAX_AGE_MS) {
    throw new BookingRuleError('live_check', 'price is stale; check again before booking');
  }
  if (offer.refundable !== true) {
    throw new BookingRuleError('refundable', 'only refundable options can be booked in V1');
  }
  if (!(offer.price > 0)) {
    throw new BookingRuleError('price', 'offer has no valid price');
  }
  if (offer.price > groupCap) {
    throw new BookingRuleError('group_cap', `price ${offer.price} is above the group cap ${groupCap}`);
  }
}
