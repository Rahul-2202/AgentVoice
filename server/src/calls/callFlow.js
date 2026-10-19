// Call flow (PRD 7.8). Go says who it will call and why, then waits 30
// seconds for a stop from the group. If nobody stops it, the call is placed
// with the AI disclosure as the opening line.
import { checkCallPolicy } from './policy.js';
import { buildOpening, hasAiDisclosure } from './disclosure.js';

export const STOP_WINDOW_MS = 30_000;

// Resolves 'stopped' if a stop arrives in time, otherwise 'proceed'.
// `stopSignal` is a promise that resolves when someone says stop.
export function waitForStop({ stopSignal, waitMs = STOP_WINDOW_MS }) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve('proceed'), waitMs);
  });
  const stop = Promise.resolve(stopSignal).then(() => 'stopped');
  return Promise.race([stop, timeout]).finally(() => clearTimeout(timer));
}

export async function startCall({
  to,
  callee,
  reason,
  requestedBy,
  mode,
  allowlist,
  provider,
  stopSignal,
  waitMs = STOP_WINDOW_MS,
  announce = async () => {},
}) {
  // Policy first: nothing is announced or dialled for a refused number.
  checkCallPolicy({ mode, to, allowlist });

  const opening = buildOpening({ callee, reason, requestedBy });
  if (!hasAiDisclosure(opening)) {
    throw new Error('opening script is missing the AI disclosure');
  }

  await announce({ to, callee, reason, text: `Calling ${callee} about ${reason} in ${waitMs / 1000} seconds. Say stop to cancel.` });

  const outcome = await waitForStop({ stopSignal, waitMs });
  if (outcome === 'stopped') {
    return { status: 'stopped', to };
  }

  const placed = await provider.placeCall({ to, opening });
  return { status: 'placed', to, callSid: placed.callSid, opening };
}
