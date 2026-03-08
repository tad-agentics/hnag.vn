import type { DishForRules, DishAdaptationRow, RuleResult } from '../types';

/** beo_phi: no member_name in adapt pill (avoid stigma). */
function buildAdaptResult(adaptation: DishAdaptationRow, _memberName?: string): Partial<RuleResult> {
  return {
    safety_parameters: (adaptation.safety_parameters as RuleResult['safety_parameters']) ?? undefined,
    fallback_steps_vi: adaptation.fallback_steps_vi ?? undefined,
    llm_prompt_hint: adaptation.llm_prompt_hint ?? undefined,
    adaptation: {
      label_vi: 'Điều chỉnh phần — bữa nhẹ hơn',
      steps_vi: adaptation.fallback_steps_vi ?? [],
    },
  };
}

export function evaluateBeoPhi(
  dish: DishForRules,
  getAdaptation: (dishId: string, condition: string) => Promise<DishAdaptationRow | null>,
  _memberName: string
): Promise<RuleResult> {
  return (async () => {
    const calories = dish.calories ?? 0;
    const sugar = dish.added_sugar_level ?? 'low';
    if (calories > 600 || sugar === 'high') {
      const adaptation = await getAdaptation(dish.id, 'beo_phi');
      if (adaptation?.dietitian_verified)
        return {
          action: 'adapt',
          reason: calories > 600 ? 'high_calorie' : 'high_sugar',
          ...buildAdaptResult(adaptation),
        };
      return {
        action: 'caution',
        reason: 'calorie_dense',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Năng lượng cao',
      };
    }
    if (calories > 400) {
      return {
        action: 'caution',
        reason: 'moderate_calorie_dense',
        tooltip_vi: 'Dùng lượng nhỏ',
        tooltip_detail_vi: 'Ăn vừa phần, thêm rau trước',
      };
    }
    return { action: 'allow' };
  })();
}
