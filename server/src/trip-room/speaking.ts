// Speaking rules for Go in the trip room (PRD 7.1).
// Go speaks only when addressed, when a vote opens or closes, or when money
// or a booking is involved. It stays quiet otherwise.

export type RoomEvent =
  | { kind: 'chat'; text: string }
  | { kind: 'vote_opened' }
  | { kind: 'vote_closed' }
  | { kind: 'money' }
  | { kind: 'booking' };

export type SpeakDecision =
  | { speak: true; reason: 'addressed' | 'vote' | 'money' | 'booking' }
  | { speak: false };

const ADDRESSED = /(^|\s)@go\b/i;

export function isAddressedToGo(text: string): boolean {
  return ADDRESSED.test(text);
}

export function decideGoSpeaks(event: RoomEvent): SpeakDecision {
  switch (event.kind) {
    case 'chat':
      return isAddressedToGo(event.text) ? { speak: true, reason: 'addressed' } : { speak: false };
    case 'vote_opened':
    case 'vote_closed':
      return { speak: true, reason: 'vote' };
    case 'money':
      return { speak: true, reason: 'money' };
    case 'booking':
      return { speak: true, reason: 'booking' };
  }
}
