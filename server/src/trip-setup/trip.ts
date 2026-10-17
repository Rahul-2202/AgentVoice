// Trip setup (PRD 6.1). An organiser builds a trip either by six taps
// (where, when, who, budget, vibe, stay) or from one sentence, which fills
// some of the steps and leaves the rest to taps.

export const STAY_TYPES = ['hotel', 'hostel', 'homestay', 'villa'] as const;
export const VIBES = ['chill', 'adventure', 'food', 'culture', 'party'] as const;
export const SETUP_STEPS = ['where', 'when', 'who', 'budget', 'vibe', 'stay'] as const;

export type StayType = (typeof STAY_TYPES)[number];
export type Vibe = (typeof VIBES)[number];
export type SetupStep = (typeof SETUP_STEPS)[number];

// ISO calendar date, YYYY-MM-DD.
export type IsoDate = string;

// Group budget range in INR, per person. Private budgets are AGE-12, not here.
export type BudgetRange = { min: number; max: number };

export type Trip = {
  destination: string;
  startDate: IsoDate;
  endDate: IsoDate;
  groupSize: number;
  budget: BudgetRange;
  vibe: Vibe;
  stay: StayType;
};

// Partial answers collected during setup. A key is present once the step is answered.
export type TripDraft = Partial<Trip>;

export function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

// Lists the steps still unanswered, in tap order.
export function missingSteps(draft: TripDraft): SetupStep[] {
  const answered: Record<SetupStep, boolean> = {
    where: draft.destination !== undefined,
    when: draft.startDate !== undefined && draft.endDate !== undefined,
    who: draft.groupSize !== undefined,
    budget: draft.budget !== undefined,
    vibe: draft.vibe !== undefined,
    stay: draft.stay !== undefined,
  };
  return SETUP_STEPS.filter((step) => !answered[step]);
}

export function nextStep(draft: TripDraft): SetupStep | null {
  return missingSteps(draft)[0] ?? null;
}

// Checks a draft and returns the list of problems. An empty list means it can become a Trip.
export function validateDraft(draft: TripDraft, today: IsoDate): string[] {
  const problems: string[] = [];
  if (draft.destination !== undefined && draft.destination.trim() === '') {
    problems.push('where: destination is empty');
  }
  if (draft.startDate !== undefined && !isIsoDate(draft.startDate)) {
    problems.push('when: start date is not a real date');
  }
  if (draft.endDate !== undefined && !isIsoDate(draft.endDate)) {
    problems.push('when: end date is not a real date');
  }
  if (draft.startDate && draft.endDate && isIsoDate(draft.startDate) && isIsoDate(draft.endDate)) {
    if (draft.endDate < draft.startDate) problems.push('when: end date is before start date');
    if (draft.startDate < today) problems.push('when: start date is in the past');
  }
  if (draft.groupSize !== undefined && (!Number.isInteger(draft.groupSize) || draft.groupSize < 1)) {
    problems.push('who: group size must be a whole number of at least 1');
  }
  if (draft.budget !== undefined) {
    const { min, max } = draft.budget;
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) {
      problems.push('budget: range must be from zero up to a max no lower than the min');
    }
  }
  return problems;
}

// Turns a complete, valid draft into a Trip. Throws listing what is missing or wrong.
export function buildTrip(draft: TripDraft, today: IsoDate): Trip {
  const missing = missingSteps(draft);
  if (missing.length > 0) {
    throw new Error(`trip setup is missing: ${missing.join(', ')}`);
  }
  const problems = validateDraft(draft, today);
  if (problems.length > 0) {
    throw new Error(`trip setup is invalid: ${problems.join('; ')}`);
  }
  return {
    destination: draft.destination!.trim(),
    startDate: draft.startDate!,
    endDate: draft.endDate!,
    groupSize: draft.groupSize!,
    budget: draft.budget!,
    vibe: draft.vibe!,
    stay: draft.stay!,
  };
}
