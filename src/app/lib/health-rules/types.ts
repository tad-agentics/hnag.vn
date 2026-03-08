/**
 * Health Rule Engine types (tech-spec §06).
 * Deterministic, no LLM. 100% test coverage target.
 */

export type RuleAction = 'allow' | 'adapt' | 'caution' | 'block';

export type SafetyParameters = {
  max_sodium_mg_per_serving?: number;
  protein_reduction_pct?: number;
  portion_max_g?: number;
  max_cholesterol_mg?: number;
  max_potassium_mg_per_serving?: number;
  max_phosphorus_mg_per_serving?: number;
  max_sat_fat_g_per_serving?: number;
  max_added_sugar_g_per_serving?: number;
  max_calories_per_serving?: number;
  forbidden_ingredients?: string[];
  required_substitutions?: { from: string; to: string }[];
  cooking_method_override?: string;
};

export interface RuleResult {
  action: RuleAction;
  reason?: string;
  tooltip_vi?: string;
  tooltip_detail_vi?: string;
  safety_parameters?: SafetyParameters;
  fallback_steps_vi?: string[];
  llm_prompt_hint?: string | null;
  adaptation?: { label_vi: string; steps_vi: string[] };
  member_name?: string;
}

/** Dish row as needed by rule evaluators (subset of DB). */
export interface DishForRules {
  id: string;
  purine_level?: string | null;
  glycemic_index?: number | null;
  sodium_mg?: number | null;
  category?: string | null;
  sat_fat_level?: string | null;
  added_sugar_level?: string | null;
  potassium_level?: string | null;
  phosphorus_level?: string | null;
  protein_g?: number | null;
  fat_g?: number | null;
  calories?: number | null;
  fiber_level?: string | null;
}

/** One row from dish_adaptations for a (dish_id, condition). */
export interface DishAdaptationRow {
  dietitian_verified: boolean;
  fallback_steps_vi: string[] | null;
  safety_parameters: Record<string, unknown> | null;
  llm_prompt_hint: string | null;
}

/** Family member for rule evaluation. */
export interface FamilyMemberForRules {
  id: string;
  name: string;
  health_conditions: string[];
}

/** Per-member result before aggregation. */
export interface MemberRuleResult extends RuleResult {
  member_id: string;
  member_name: string;
}

/** Aggregated result for the family (one block = block; else adapt/caution/allow). */
export interface FamilyRuleResult {
  action: RuleAction;
  tooltip_vi?: string;
  tooltip_detail_vi?: string;
  adapt_contexts?: Array<{
    member_name: string;
    reason: string;
    safety_parameters?: SafetyParameters;
    fallback_steps_vi: string[];
    llm_prompt_hint?: string | null;
  }>;
  cautions?: Array<{ reason: string; tooltip_vi?: string; tooltip_detail_vi?: string }>;
}
