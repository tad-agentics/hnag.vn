import { supabase } from '@/lib/supabase';
import type { DishCard } from '@/app/utils/types';
import {
  getAdaptation as getAdaptationCore,
  getFamilyMembersForRules as getFamilyMembersForRulesCore,
  getRecentDishIdsForSlot as getRecentDishIdsForSlotCore,
  fetchDeck as fetchDeckCore,
  upsertPreferenceOnSwipe as upsertPreferenceOnSwipeCore,
  recordSwipe as recordSwipeCore,
  saveMealPlan as saveMealPlanCore,
} from '@/app/lib/deck-core';

export async function getAdaptation(dishId: string, condition: string) {
  return getAdaptationCore(supabase, dishId, condition);
}

export async function getFamilyMembersForRules(userId: string) {
  return getFamilyMembersForRulesCore(supabase, userId);
}

export async function getRecentDishIdsForSlot(userId: string, slotType: string, days: number) {
  return getRecentDishIdsForSlotCore(supabase, userId, slotType, days);
}

export interface FetchDeckOptions {
  userId?: string | null;
  sessionId?: string;
  accessToken?: string | null;
}

/**
 * Fetch deck for a slot. Uses API when accessToken and sessionId are provided; otherwise uses Supabase (legacy).
 */
export async function fetchDeck(
  mealType: string,
  slotType: string,
  limit = 8,
  options?: FetchDeckOptions
): Promise<DishCard[]> {
  const { sessionId, accessToken, userId } = options ?? {};
  if (accessToken && sessionId) {
    const res = await fetch('/api/deck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        meal_type: mealType,
        slot_type: slotType,
        session_id: sessionId,
      }),
    });
    if (!res.ok) {
      if (res.status === 401) return [];
      throw new Error(await res.text());
    }
    const data = (await res.json()) as { dishes: DishCard[] };
    return data.dishes ?? [];
  }
  return fetchDeckCore(supabase, mealType, slotType, limit, userId ?? undefined);
}

export async function upsertPreferenceOnSwipe(
  userId: string,
  dishId: string,
  direction: 'right' | 'left'
) {
  return upsertPreferenceOnSwipeCore(supabase, userId, dishId, direction);
}

export interface RecordSwipeOptions {
  accessToken?: string | null;
}

/**
 * Record a swipe. Uses API when accessToken is provided; otherwise uses Supabase (legacy).
 */
export async function recordSwipe(
  userId: string,
  dishId: string,
  direction: 'right' | 'left' | 'defer',
  mealType: string,
  slotType: string,
  sessionId: string,
  deckPosition: number,
  options?: RecordSwipeOptions
): Promise<void> {
  if (options?.accessToken) {
    const res = await fetch('/api/swipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.accessToken}`,
      },
      body: JSON.stringify({
        dish_id: dishId,
        direction,
        meal_type: mealType,
        slot_type: slotType,
        session_id: sessionId,
        deck_position: deckPosition,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }
  return recordSwipeCore(supabase, userId, dishId, direction, mealType, slotType, sessionId, deckPosition);
}

export interface SaveMealPlanOptions {
  accessToken?: string | null;
}

/**
 * Save meal plan. Uses API when accessToken is provided; otherwise uses Supabase (legacy).
 */
export async function saveMealPlan(
  userId: string,
  mealDate: string,
  mealType: string,
  dishes: Array<{ dish_id: string; slot_type: string; is_auto?: boolean }>,
  options?: SaveMealPlanOptions
): Promise<void> {
  if (options?.accessToken) {
    const res = await fetch('/api/meal-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.accessToken}`,
      },
      body: JSON.stringify({ meal_date: mealDate, meal_type: mealType, dishes }),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }
  return saveMealPlanCore(supabase, userId, mealDate, mealType, dishes);
}
