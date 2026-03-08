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

export function evaluateDiabetes(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const gi = dish.glycemic_index ?? 55;
    if (gi >= 70) {
      const adaptation = await getAdaptation(dish.id, 'diabetes');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'high_gi' };
      return { action: 'adapt', reason: 'high_gi', ...buildAdaptResult(adaptation, memberName) };
    }
    if (gi >= 55) {
      return {
        action: 'caution',
        reason: 'medium_gi',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'GI trung bình — ăn rau trước cơm',
      };
    }
    return { action: 'allow' };
  })();
}
