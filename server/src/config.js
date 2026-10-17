// Runtime settings for the booking pipeline. V1 defaults to the fake ixigo
// connector and a simulated payment, so no money can move.
export const TRAVEL_MODE = process.env.TRAVEL_MODE ?? 'fake_ixigo';
export const CALLS_MODE = process.env.CALLS_MODE ?? 'off';

// A price older than this is treated as unchecked and cannot be booked.
export const PRICE_MAX_AGE_MS = 15 * 60 * 1000;

export const ALLOWED_TRAVEL_MODES = ['fake_ixigo'];

export function assertTravelMode(mode = TRAVEL_MODE) {
  // ixigo_web (live) is out of V1 unless the CEO approves it (PRD section 10).
  if (!ALLOWED_TRAVEL_MODES.includes(mode)) {
    throw new Error(`TRAVEL_MODE=${mode} is not available in V1`);
  }
  return mode;
}
