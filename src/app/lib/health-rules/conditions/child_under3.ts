import type { DishForRules, DishAdaptationRow, RuleResult } from '../types';

function buildAdaptResult(adaptation: DishAdaptationRow, memberName?: string): Partial<RuleResult> {
  return {
    safety_parameters: (adaptation.safety_parameters as RuleResult['safety_parameters']) ?? undefined,
    fallback_steps_vi: adaptation.fallback_steps_vi ?? undefined,
    llm_prompt_hint: adaptation.llm_prompt_hint ?? undefined,
    adaptation: { label_vi: 'Điều chỉnh cho trẻ', steps_vi: adaptation.fallback_steps_vi ?? [] },
    ...(memberName && { member_name: memberName }),
  };
}

export function evaluateChildUnder3(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const sodium = dish.sodium_mg ?? 0;
    if (sodium > 400) {
      const adaptation = await getAdaptation(dish.id, 'child_under3');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'sodium_high_child' };
      return { action: 'adapt', reason: 'sodium_high_child', ...buildAdaptResult(adaptation, memberName) };
    }
    return { action: 'allow' };
  })();
}
