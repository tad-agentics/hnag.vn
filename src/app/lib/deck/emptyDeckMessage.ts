/**
 * Empty deck — template-first (no LLM). Tech-spec §07.
 * Single factor → template lookup. Server may validate action against ALLOWED_DECK_ACTIONS.
 */
export const ALLOWED_DECK_ACTIONS = [
  'relax_budget',
  'change_slot',
  'manual_input',
  'relax_cooldown',
  'disable_fridge',
] as const;

export type EmptyDeckAction = (typeof ALLOWED_DECK_ACTIONS)[number];

export interface EmptyDeckResult {
  title: string;
  description: string;
  allowedActions: readonly EmptyDeckAction[];
}

/**
 * Returns template copy and allowed actions for empty deck state.
 * reasons: optional sorted list of factors (e.g. ['health', 'cooldown']) for future 2-factor matrix.
 */
export function getEmptyDeckMessage(
  slotName?: string,
  _reasons?: string[]
): EmptyDeckResult {
  const slot = slotName ?? 'này';
  return {
    title: `Đã xem hết món phù hợp cho slot ${slot}`,
    description:
      'Thử mở rộng điều kiện lọc, đổi loại slot, hoặc nhập tên món.',
    allowedActions: ALLOWED_DECK_ACTIONS,
  };
}
