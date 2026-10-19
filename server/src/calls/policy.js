// Call policy (PRD 7.8). Calls are off unless CALLS_MODE is set to 'live',
// and a number can only be called if it is on the allowlist. Both checks
// run before anything else, so a refused call never reaches the provider.
import { CALLS_MODE } from '../config.js';

export class CallPolicyError extends Error {
  constructor(rule, message) {
    super(message);
    this.name = 'CallPolicyError';
    this.rule = rule;
  }
}

const E164 = /^\+[1-9]\d{6,14}$/;

export function checkCallPolicy({ mode = CALLS_MODE, to, allowlist = [] }) {
  if (mode !== 'live') {
    throw new CallPolicyError('calls_off', 'phone calls are off (CALLS_MODE is not live)');
  }
  if (!E164.test(to ?? '')) {
    throw new CallPolicyError('number_format', 'callee number must be in E.164 format');
  }
  if (!allowlist.includes(to)) {
    throw new CallPolicyError('allowlist', 'callee is not on the call allowlist');
  }
}
