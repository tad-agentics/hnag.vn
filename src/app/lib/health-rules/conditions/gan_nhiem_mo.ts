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

export function evaluateGanNhiemMo(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const sat = dish.sat_fat_level ?? 'medium';
    const sugar = dish.added_sugar_level ?? 'medium';
    if (sat === 'high' && sugar === 'high') {
      const adaptation = await getAdaptation(dish.id, 'gan_nhiem_mo');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'high_fat_high_sugar' };
      return { action: 'adapt', reason: 'high_fat_high_sugar', ...buildAdaptResult(adaptation, memberName) };
    }
    if (sat === 'high' || sugar === 'high') {
      const adaptation = await getAdaptation(dish.id, 'gan_nhiem_mo');
      if (adaptation?.dietitian_verified)
        return {
          action: 'adapt',
          reason: sat === 'high' ? 'sat_fat_high' : 'added_sugar_high',
          ...buildAdaptResult(adaptation, memberName),
        };
      return {
        action: 'caution',
        reason: 'fat_or_sugar_elevated',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Tinh bột/đường trung bình',
      };
    }
    return { action: 'allow' };
  })();
}
