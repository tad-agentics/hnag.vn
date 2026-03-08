/**
 * Health Rule Engine — family aggregation and per-dish evaluation.
 * Tech-spec §06. Deterministic, no LLM. 100% test coverage target.
 */

import type {
  DishForRules,
  FamilyMemberForRules,
  RuleResult,
  RuleAction,
  MemberRuleResult,
  FamilyRuleResult,
  DishAdaptationRow,
} from './types';
import { evaluateGout } from './conditions/gout';
import { evaluateDiabetes } from './conditions/diabetes';
import { evaluateHypertension } from './conditions/hypertension';
import { evaluateGastritis } from './conditions/gastritis';
import { evaluateChildUnder3 } from './conditions/child_under3';
import { evaluateMoMauCao } from './conditions/mo_mau_cao';
import { evaluateGanNhiemMo } from './conditions/gan_nhiem_mo';
import { evaluateSuyThan } from './conditions/suy_than';
import { evaluateBeoPhi } from './conditions/beo_phi';

export type GetAdaptationFn = (dishId: string, condition: string) => Promise<DishAdaptationRow | null>;

const CONDITION_EVALUATORS: Record<
  string,
  (dish: DishForRules, getAdaptation: GetAdaptationFn, memberName: string) => Promise<RuleResult>
> = {
  gout: evaluateGout,
  diabetes: evaluateDiabetes,
  hypertension: evaluateHypertension,
  gastritis: evaluateGastritis,
  child_under3: evaluateChildUnder3,
  mo_mau_cao: evaluateMoMauCao,
  gan_nhiem_mo: evaluateGanNhiemMo,
  suy_than: evaluateSuyThan,
  beo_phi: evaluateBeoPhi,
};

/** Map onboarding/DB health_conditions to engine condition codes. */
const NORMALIZE_CONDITION: Record<string, string> = {
  none: '',
  gout: 'gout',
  diabetes: 'diabetes',
  hypertension: 'hypertension',
  gastritis: 'gastritis',
  child_under3: 'child_under3',
  mo_mau_cao: 'mo_mau_cao',
  gan_nhiem_mo: 'gan_nhiem_mo',
  suy_than: 'suy_than',
  beo_phi: 'beo_phi',
};

function aggregateResults(results: MemberRuleResult[]): FamilyRuleResult {
  const hasBlock = results.some((r) => r.action === 'block');
  const adaptions = results.filter((r) => r.action === 'adapt');
  const cautions = results.filter((r) => r.action === 'caution');

  if (hasBlock) return { action: 'block' };
  if (adaptions.length > 0)
    return {
      action: 'adapt',
      adapt_contexts: adaptions.map((r) => ({
        member_name: r.member_name,
        reason: r.reason ?? '',
        safety_parameters: r.safety_parameters,
        fallback_steps_vi: r.fallback_steps_vi ?? [],
        llm_prompt_hint: r.llm_prompt_hint,
      })),
    };
  if (cautions.length > 0)
    return {
      action: 'caution',
      cautions: cautions.map((r) => ({
        reason: r.reason ?? '',
        tooltip_vi: r.tooltip_vi,
        tooltip_detail_vi: r.tooltip_detail_vi,
      })),
      tooltip_vi: cautions[0]?.tooltip_vi,
      tooltip_detail_vi: cautions[0]?.tooltip_detail_vi,
    };
  return { action: 'allow' };
}

/**
 * Evaluate one dish against all family members' health conditions.
 * Returns aggregated FamilyRuleResult (one block => block; else adapt > caution > allow).
 */
export async function evaluateDishForFamily(
  dish: DishForRules,
  family: FamilyMemberForRules[],
  getAdaptation: GetAdaptationFn
): Promise<FamilyRuleResult> {
  const memberResults: MemberRuleResult[] = [];

  for (const member of family) {
    const conditions = member.health_conditions ?? [];
    for (const raw of conditions) {
      const condition = NORMALIZE_CONDITION[raw] ?? raw;
      if (!condition || !CONDITION_EVALUATORS[condition]) continue;
      const evaluator = CONDITION_EVALUATORS[condition];
      const result = await evaluator(dish, getAdaptation, member.name);
      memberResults.push({
        ...result,
        member_id: member.id,
        member_name: member.name,
      });
    }
  }

  if (memberResults.length === 0) return { action: 'allow' };
  return aggregateResults(memberResults);
}

/** Action priority for UI: block > adapt > caution > allow. */
export function worstAction(a: RuleAction, b: RuleAction): RuleAction {
  const order: RuleAction[] = ['block', 'adapt', 'caution', 'allow'];
  const i = order.indexOf(a);
  const j = order.indexOf(b);
  return order[Math.min(i, j)];
}
