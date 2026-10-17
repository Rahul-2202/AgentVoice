// Every call opens with a disclosure that Go is an AI (PRD 7.8, 11).
export const AI_DISCLOSURE = 'Hi, this is Go, an AI assistant calling for your trip group.';

export function buildOpening({ callee, reason, requestedBy }) {
  return `${AI_DISCLOSURE} ${requestedBy} asked me to call about ${reason}. Is this a good time to talk?`;
}

// The opening must start with the disclosure. Callers check this before a
// call is placed, so a script with the disclosure removed cannot be dialled.
export function hasAiDisclosure(text) {
  return typeof text === 'string' && text.startsWith(AI_DISCLOSURE);
}
