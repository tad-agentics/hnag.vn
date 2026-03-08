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

export function evaluateSuyThan(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    const K = dish.potassium_level ?? 'medium';
    const P = dish.phosphorus_level ?? 'medium';
    const protein = Number(dish.protein_g) ?? 0;

    if (K === 'high')
      return {
        action: 'block',
        reason: 'potassium_high',
        tooltip_vi: 'Kali cao — không phù hợp người suy thận',
      };
    if (P === 'high')
      return {
        action: 'block',
        reason: 'phosphorus_high',
        tooltip_vi: 'Phốt pho cao — không phù hợp người suy thận',
      };

    if (protein > 20) {
      const adaptation = await getAdaptation(dish.id, 'suy_than');
      if (adaptation?.dietitian_verified)
        return { action: 'adapt', reason: 'protein_high', ...buildAdaptResult(adaptation, memberName) };
      return {
        action: 'caution',
        reason: 'protein_elevated',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Đạm cao — ăn nửa phần',
      };
    }
    if (K === 'medium' || P === 'medium') {
      return {
        action: 'caution',
        reason: 'kp_medium',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Muối/kali trung bình',
      };
    }
    return { action: 'allow' };
  })();
}
