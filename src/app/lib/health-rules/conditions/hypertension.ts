import type { DishForRules, DishAdaptationRow, RuleResult } from '../types';

function buildAdaptResult(adaptation: DishAdaptationRow, memberName?: string): Partial<RuleResult> {
  return {
    safety_parameters: (adaptation.safety_parameters as RuleResult['safety_parameters']) ?? undefined,
    fallback_steps_vi: adaptation.fallback_steps_vi ?? undefined,
    llm_prompt_hint: adaptation.llm_prompt_hint ?? undefined,
    adaptation: { label_vi: 'Điều chỉnh cho gia đình', steps_vi: adaptation.fallback_steps_vi ?? [] },
    ...(memberName && { member_name: memberName }),
  };
}

export function evaluateHypertension(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const sodium = dish.sodium_mg ?? 0;
    if (sodium > 800) {
      const adaptation = await getAdaptation(dish.id, 'hypertension');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'sodium_high' };
      return { action: 'adapt', reason: 'sodium_high', ...buildAdaptResult(adaptation, memberName) };
    }
    if (sodium > 400) {
      const adaptation = await getAdaptation(dish.id, 'hypertension');
      if (adaptation?.dietitian_verified)
        return { action: 'adapt', reason: 'sodium_medium', ...buildAdaptResult(adaptation, memberName) };
      return {
        action: 'caution',
        reason: 'sodium_medium',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Muối/natri trung bình',
      };
    }
    return { action: 'allow' };
  })();
}
