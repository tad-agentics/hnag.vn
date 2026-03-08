import type { DishForRules, DishAdaptationRow, RuleResult } from '../types';

function buildAdaptResult(adaptation: DishAdaptationRow, memberName?: string): Partial<RuleResult> {
  return {
    safety_parameters: (adaptation.safety_parameters as RuleResult['safety_parameters']) ?? undefined,
    fallback_steps_vi: adaptation.fallback_steps_vi ?? undefined,
    llm_prompt_hint: adaptation.llm_prompt_hint ?? undefined,
    adaptation: {
      label_vi: 'Điều chỉnh cho gia đình',
      steps_vi: adaptation.fallback_steps_vi ?? [],
    },
    ...(memberName && { member_name: memberName }),
  };
}

export function evaluateGout(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  memberName: string
): Promise<RuleResult> {
  return (async () => {
    if (dish.purine_level === 'high') {
      const adaptation = await getAdaptation(dish.id, 'gout');
      if (!adaptation?.dietitian_verified)
        return { action: 'block', reason: 'purine_high' };
      return {
        action: 'adapt',
        reason: 'purine_high',
        ...buildAdaptResult(adaptation, memberName),
      };
    }
    if (dish.purine_level === 'medium') {
      const adaptation = await getAdaptation(dish.id, 'gout');
      if (adaptation?.dietitian_verified)
        return {
          action: 'adapt',
          reason: 'purine_medium',
          ...buildAdaptResult(adaptation, memberName),
        };
      return {
        action: 'caution',
        reason: 'purine_medium',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Nhân purin trung bình',
      };
    }
    return { action: 'allow' };
  })();
}
