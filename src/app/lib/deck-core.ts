import type { SupabaseClient } from '@supabase/supabase-js';
import type { DishCard } from '../utils/types';
import type {
  DishForRules,
  FamilyMemberForRules,
  DishAdaptationRow,
} from './health-rules/types';
import { evaluateDishForFamily } from './health-rules/engine';

const DISH_TYPE_MAP: Record<string, string> = {
  protein: 'man',
  soup: 'canh',
  vegetable: 'rau',
  rice: 'tinh_bot',
};

/** Cooldown days by dish_type (tech-spec §07). */
const COOLDOWN_DAYS: Record<string, number> = {
  man: 5,
  canh: 3,
  rau: 2,
  tinh_bot: 0,
};

const DISH_SELECT_FIELDS =
  'id, name_vi, image_url, cook_time_minutes, budget_tier, dish_type, suitable_conditions, caution_conditions, purine_level, glycemic_index, sodium_mg, category, sat_fat_level, added_sugar_level, potassium_level, phosphorus_level, protein_g, fat_g, calories, fiber_level';

function rowToDishForRules(row: Record<string, unknown>): DishForRules {
  return {
    id: String(row.id),
    purine_level: (row.purine_level as string) ?? null,
    glycemic_index: (row.glycemic_index as number) ?? null,
    sodium_mg: (row.sodium_mg as number) ?? null,
    category: (row.category as string) ?? null,
    sat_fat_level: (row.sat_fat_level as string) ?? null,
    added_sugar_level: (row.added_sugar_level as string) ?? null,
    potassium_level: (row.potassium_level as string) ?? null,
    phosphorus_level: (row.phosphorus_level as string) ?? null,
    protein_g: (row.protein_g as number) ?? null,
    fat_g: (row.fat_g as number) ?? null,
    calories: (row.calories as number) ?? null,
    fiber_level: (row.fiber_level as string) ?? null,
  };
}

/** Fetch one adaptation row for (dish_id, condition). Used by Health Rule Engine. */
export async function getAdaptation(
  client: SupabaseClient,
  dishId: string,
  condition: string
): Promise<DishAdaptationRow | null> {
  const { data, error } = await client
    .from('dish_adaptations')
    .select('dietitian_verified, fallback_steps_vi, safety_parameters, llm_prompt_hint')
    .eq('dish_id', dishId)
    .eq('condition', condition)
    .maybeSingle();
  if (error || !data) return null;
  return {
    dietitian_verified: Boolean(data.dietitian_verified),
    fallback_steps_vi: (data.fallback_steps_vi as string[] | null) ?? null,
    safety_parameters: (data.safety_parameters as Record<string, unknown> | null) ?? null,
    llm_prompt_hint: (data.llm_prompt_hint as string | null) ?? null,
  };
}

/** Family members for rule evaluation (id, name, health_conditions). */
export async function getFamilyMembersForRules(
  client: SupabaseClient,
  userId: string
): Promise<FamilyMemberForRules[]> {
  const { data, error } = await client
    .from('family_members')
    .select('id, name, health_conditions')
    .eq('user_id', userId)
    .is('deleted_at', null);
  if (error) return [];
  return (data ?? []).map((r) => ({
    id: String(r.id),
    name: r.name ?? '',
    health_conditions: (r.health_conditions ?? []).filter((c: string) => c && c !== 'none'),
  }));
}

/** Dish IDs used for this slot in the last N days (from meal_plans). */
export async function getRecentDishIdsForSlot(
  client: SupabaseClient,
  userId: string,
  slotType: string,
  days: number
): Promise<Set<string>> {
  if (days <= 0) return new Set();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);
  const { data, error } = await client
    .from('meal_plans')
    .select('dishes')
    .eq('user_id', userId)
    .gte('meal_date', sinceStr);
  if (error) return new Set();
  const ids = new Set<string>();
  for (const row of data ?? []) {
    const dishes = (row.dishes as Array<{ dish_id?: string; slot_type?: string }>) ?? [];
    for (const d of dishes) {
      if (d.slot_type === slotType && d.dish_id) ids.add(d.dish_id);
    }
  }
  return ids;
}

/**
 * Fetch deck for a slot. When userId is provided, runs Health Rule Engine and cooldown.
 * Returns up to `limit` DishCards with healthAction/healthTooltip/memberAdaptations when applicable.
 */
export async function fetchDeck(
  client: SupabaseClient,
  mealType: string,
  slotType: string,
  limit = 8,
  userId?: string | null
): Promise<DishCard[]> {
  const dishType = DISH_TYPE_MAP[slotType] ?? 'man';
  const { data: rows, error } = await client
    .from('dishes')
    .select(DISH_SELECT_FIELDS)
    .eq('is_published', true)
    .eq('image_status', 'ready')
    .eq('dish_type', dishType)
    .limit(Math.max(limit, 32));
  if (error) return [];
  const allDishes = (rows ?? []) as unknown as Record<string, unknown>[];

  let passed: Array<{
    row: Record<string, unknown>;
    ruleResult: {
      action: string;
      tooltip_vi?: string;
      tooltip_detail_vi?: string;
      adapt_contexts?: Array<{
        member_name: string;
        reason: string;
        fallback_steps_vi: string[];
      }>;
    };
  }> = allDishes.map((row) => ({
    row,
    ruleResult: { action: 'allow' as const },
  }));

  if (userId) {
    const family = await getFamilyMembersForRules(client, userId);
    const getAdaptationFn = (dishId: string, condition: string) =>
      getAdaptation(client, dishId, condition);
    const ruleResults = await Promise.all(
      allDishes.map(async (row) => {
        const dish = rowToDishForRules(row);
        const ruleResult = await evaluateDishForFamily(dish, family, getAdaptationFn);
        return { row, ruleResult };
      })
    );
    passed = ruleResults.filter(({ ruleResult }) => ruleResult.action !== 'block');

    const cooldownDays = COOLDOWN_DAYS[dishType] ?? 0;
    if (cooldownDays > 0) {
      const recentIds = await getRecentDishIdsForSlot(client, userId, slotType, cooldownDays);
      passed = passed.filter(({ row }) => !recentIds.has(String(row.id)));
    }
  }

  const dishTypeLabel =
    slotType === 'protein'
      ? 'Món mặn'
      : slotType === 'soup'
        ? 'Món canh'
        : slotType === 'vegetable'
          ? 'Rau'
          : 'Cơm';

  return passed.slice(0, limit).map(({ row, ruleResult }) => ({
    id: String(row.id),
    name: (row.name_vi as string) ?? '',
    imageUrl: (row.image_url as string) ?? '',
    cookingTime: row.cook_time_minutes ? `${row.cook_time_minutes} phút` : '',
    cost: row.budget_tier === 'low' ? '~50k' : row.budget_tier === 'high' ? '~150k' : '~85k',
    healthTags: [
      ...((row.suitable_conditions as string[]) ?? []),
      ...((row.caution_conditions as string[]) ?? []),
    ],
    dishType: dishTypeLabel,
    healthAction:
      ruleResult.action === 'allow' ? undefined : (ruleResult.action as 'adapt' | 'caution'),
    healthTooltip: ruleResult.tooltip_vi,
    healthTooltipDetail: ruleResult.tooltip_detail_vi,
    memberAdaptations:
      ruleResult.adapt_contexts?.map((a) => ({
        member_name: a.member_name,
        label_vi: 'Điều chỉnh cho gia đình',
        steps_vi: a.fallback_steps_vi ?? [],
      })),
  }));
}

const SIGNAL_WEIGHTS = { swipe_right: 0.3, swipe_left: -0.15 } as const;

function clampScore(s: number): number {
  return Math.max(-1, Math.min(1, s));
}

/** Update or insert user_preferences after a swipe (tech-spec §08). Uses member_id = null for household preference. */
export async function upsertPreferenceOnSwipe(
  client: SupabaseClient,
  userId: string,
  dishId: string,
  direction: 'right' | 'left'
): Promise<void> {
  const delta = direction === 'right' ? SIGNAL_WEIGHTS.swipe_right : SIGNAL_WEIGHTS.swipe_left;
  const { data: existing } = await client
    .from('user_preferences')
    .select('score, right_count, left_count')
    .eq('user_id', userId)
    .eq('dish_id', dishId)
    .is('member_id', null)
    .maybeSingle();

  const score = clampScore(Number(existing?.score ?? 0) + delta);
  const right_count = (existing?.right_count ?? 0) + (direction === 'right' ? 1 : 0);
  const left_count = (existing?.left_count ?? 0) + (direction === 'left' ? 1 : 0);

  if (existing) {
    await client
      .from('user_preferences')
      .update({ score, right_count, left_count, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('dish_id', dishId)
      .is('member_id', null);
  } else {
    await client.from('user_preferences').insert({
      user_id: userId,
      dish_id: dishId,
      member_id: null,
      score,
      right_count,
      left_count,
    });
  }
}

/** Record a swipe event and update preference score for right/left. */
export async function recordSwipe(
  client: SupabaseClient,
  userId: string,
  dishId: string,
  direction: 'right' | 'left' | 'defer',
  mealType: string,
  slotType: string,
  sessionId: string,
  deckPosition: number
): Promise<void> {
  await client.from('swipe_events').insert({
    user_id: userId,
    dish_id: dishId,
    direction,
    meal_type: mealType,
    slot_type: slotType,
    session_id: sessionId,
    deck_position: deckPosition,
  });
  if (direction === 'right' || direction === 'left') {
    upsertPreferenceOnSwipe(client, userId, dishId, direction).catch(() => {});
  }
}

/** Save meal plan (summary) after all slots are filled. */
export async function saveMealPlan(
  client: SupabaseClient,
  userId: string,
  mealDate: string,
  mealType: string,
  dishes: Array<{ dish_id: string; slot_type: string; is_auto?: boolean }>
): Promise<void> {
  await client.from('meal_plans').insert({
    user_id: userId,
    meal_date: mealDate,
    meal_type: mealType,
    dishes,
    status: 'planned',
  });
}
