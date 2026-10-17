// One-sentence trip setup (PRD 6.1). Reads what it can from a sentence such as
// "goa, 12-15 march, 4 of us, 20k-30k each, chill, villa" and leaves the
// rest for taps. Anything it cannot read is left out, never guessed.

import { STAY_TYPES, VIBES, type IsoDate, type TripDraft } from './trip.ts';

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// Captures the three-letter month; the rest of the month name is ignored.
const MONTH = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*';

function iso(year: number, month: number, day: number): IsoDate {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// The year for a day-month without a year: the next occurrence on or after today.
function nextYear(month: number, day: number, today: IsoDate): number {
  const year = Number(today.slice(0, 4));
  const candidate = iso(year, month, day);
  return candidate >= today ? year : year + 1;
}

export function parseSentence(text: string, today: IsoDate): TripDraft {
  const draft: TripDraft = {};
  let rest = text.toLowerCase();

  // when: "12-15 march" (start month implied) or "28 december - 3 january"
  const dates = new RegExp(`(\\d{1,2})\\s*(?:${MONTH})?\\s*(?:-|to|–)\\s*(\\d{1,2})\\s*${MONTH}`).exec(rest);
  if (dates) {
    const startDay = Number(dates[1]);
    const endDay = Number(dates[3]);
    const endMonth = MONTHS[dates[4]];
    const startMonth = MONTHS[dates[2] ?? ''] ?? endMonth;
    if (startDay >= 1 && startDay <= 31 && endDay >= 1 && endDay <= 31) {
      const startYear = nextYear(startMonth, startDay, today);
      const endYear = endMonth < startMonth ? startYear + 1 : startYear;
      draft.startDate = iso(startYear, startMonth, startDay);
      draft.endDate = iso(endYear, endMonth, endDay);
      rest = rest.replace(dates[0], ' ');
    }
  }

  // who: "4 of us", "4 people", "4 friends"
  const who = /(\d{1,2})\s*(?:of us|people|friends|ppl|persons?)\b/.exec(rest);
  if (who) {
    draft.groupSize = Number(who[1]);
    rest = rest.replace(who[0], ' ');
  }

  // budget: "20k-30k", "₹20,000 to ₹30,000", "rs 20000 - 30000". Per person, INR.
  const budget =
    /(₹|rs\.?|inr)?\s*(\d[\d,]*)\s*(k)?\s*(?:-|to|–)\s*(₹|rs\.?|inr)?\s*(\d[\d,]*)\s*(k)?/.exec(rest);
  if (budget) {
    const min = toRupees(budget[2], budget[3]);
    const max = toRupees(budget[5], budget[6]);
    const looksLikeMoney = Boolean(budget[1] || budget[4] || budget[3] || budget[6] || min >= 1000);
    if (looksLikeMoney && max >= min) {
      draft.budget = { min, max };
      rest = rest.replace(budget[0], ' ');
    }
  }

  const vibe = VIBES.find((v) => new RegExp(`\\b${v}\\b`).test(rest));
  if (vibe) draft.vibe = vibe;

  const stay = STAY_TYPES.find((s) => new RegExp(`\\b${s}s?\\b`).test(rest));
  if (stay) draft.stay = stay;

  // where: "to goa", "in goa", or the first comma-separated phrase.
  const toPlace = /\b(?:to|in|at)\s+([a-z][a-z .'-]*?)\s*(?:,|$|\b\d|\bfor\b|\bon\b)/.exec(rest);
  const firstPhrase = rest.includes(',') ? rest.split(',')[0].trim() : '';
  const place = toPlace?.[1]?.trim() ?? firstPhrase;
  if (place && /^[a-z][a-z .'-]*$/.test(place) && place.length <= 40) {
    draft.destination = titleCase(place);
  }

  return draft;
}

function toRupees(amount: string, kSuffix: string | undefined): number {
  const value = Number(amount.replace(/,/g, ''));
  return kSuffix ? value * 1000 : value;
}

function titleCase(text: string): string {
  return text.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
