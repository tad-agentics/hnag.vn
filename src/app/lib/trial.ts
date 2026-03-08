/**
 * Trial & paywall state (tech-spec §09).
 * Day 1–10: full access. Day 11–14: ribbon. Day 12 once: soft nudge. Day 15+: hard paywall.
 */

import type { UserProfile } from '@/app/contexts/AuthContext';

export type TrialPhase = 'full' | 'ribbon' | 'paywall';

export interface TrialState {
  phase: TrialPhase;
  trialDay: number;
  daysRemaining: number;
  /** True when in ribbon phase and we should show the day-12-once soft nudge (caller checks storage). */
  canShowSoftNudge: boolean;
}

const TRIAL_DAYS = 14;
const RIBBON_START_DAY = 11;
const SOFT_NUDGE_DAY = 12;

function daysSince(start: string | null): number {
  if (!start) return 0;
  const a = new Date(start);
  const b = new Date();
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

/**
 * Compute trial phase from profile. Paid (active/lifetime) => full. No trial_started_at => full.
 * trial + day 1–10 => full; 11–14 => ribbon; 15+ or expired => paywall.
 */
export function getTrialState(profile: UserProfile | null): TrialState {
  const defaultState: TrialState = {
    phase: 'full',
    trialDay: 0,
    daysRemaining: TRIAL_DAYS,
    canShowSoftNudge: false,
  };
  if (!profile) return defaultState;

  const status = profile.subscription_status ?? 'trial';
  if (status === 'active') return { ...defaultState, phase: 'full' };
  if (status === 'expired')
    return { phase: 'paywall', trialDay: TRIAL_DAYS + 1, daysRemaining: 0, canShowSoftNudge: false };

  const startedAt = profile.trial_started_at ?? null;
  const trialDay = daysSince(startedAt) + 1;
  const daysRemaining = Math.max(0, TRIAL_DAYS - trialDay + 1);

  if (trialDay <= 10)
    return { phase: 'full', trialDay, daysRemaining, canShowSoftNudge: false };
  if (trialDay <= TRIAL_DAYS)
    return {
      phase: 'ribbon',
      trialDay,
      daysRemaining,
      canShowSoftNudge: trialDay >= SOFT_NUDGE_DAY,
    };
  return { phase: 'paywall', trialDay, daysRemaining: 0, canShowSoftNudge: false };
}

const SOFT_NUDGE_KEY_PREFIX = 'hnag_soft_nudge_shown_';

export function hasSoftNudgeBeenShown(userId: string): boolean {
  try {
    return localStorage.getItem(SOFT_NUDGE_KEY_PREFIX + userId) === '1';
  } catch {
    return false;
  }
}

export function markSoftNudgeShown(userId: string): void {
  try {
    localStorage.setItem(SOFT_NUDGE_KEY_PREFIX + userId, '1');
  } catch {
    // ignore
  }
}
