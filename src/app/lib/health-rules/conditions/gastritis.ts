import type { DishForRules, DishAdaptationRow, RuleResult } from '../types';

const FRIED_SPICY_ACIDIC = new Set(['stir_fry', 'braise']);

function buildAdaptResult(adaptation: DishAdaptationRow, memberName?: string): Partial<RuleResult> {
  return {
    safety_parameters: (adaptation.safety_parameters as RuleResult['safety_parameters']) ?? undefined,
    fallback_steps_vi: adaptation.fallback_steps_vi ?? undefined,
    llm_prompt_hint: adaptation.llm_prompt_hint ?? undefined,
    adaptation: { label_vi: 'Điều chỉnh cho gia đình', steps_vi: adaptation.fallback_steps_vi ?? [] },
    ...(memberName && { member_name: memberName }),
  };
}

export function evaluateGastritis(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const category = dish.category ?? '';
    const risky = FRIED_SPICY_ACIDIC.has(category);
    if (risky) {
      const adaptation = await getAdaptation(dish.id, 'gastritis');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'fried_spicy_acidic' };
      return { action: 'adapt', reason: 'fried_spicy_acidic', ...buildAdaptResult(adaptation, memberName) };
    }
    return { action: 'allow' };
  })();
}
