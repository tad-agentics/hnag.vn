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

export function evaluateMoMauCao(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const sat = dish.sat_fat_level ?? 'medium';
    if (sat === 'high') {
      const adaptation = await getAdaptation(dish.id, 'mo_mau_cao');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'sat_fat_high' };
      return { action: 'adapt', reason: 'sat_fat_high', ...buildAdaptResult(adaptation, memberName) };
    }
    if (sat === 'medium') {
      const adaptation = await getAdaptation(dish.id, 'mo_mau_cao');
      if (adaptation?.dietitian_verified)
        return { action: 'adapt', reason: 'sat_fat_medium', ...buildAdaptResult(adaptation, memberName) };
      return {
        action: 'caution',
        reason: 'sat_fat_medium',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Cholesterol trung bình',
      };
    }
    return { action: 'allow' };
  })();
}
