import { supabase } from '@/lib/supabase';

export interface FamilyMemberInput {
  id: string;
  name: string;
  age: string;
  healthConditions?: string[];
  allergies?: string;
}

export async function saveFamilyMembers(
  userId: string,
  members: FamilyMemberInput[]
): Promise<void> {
  const existing = await supabase
    .from('family_members')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null);
  const toDelete = (existing.data ?? []).map((r) => r.id);
  if (toDelete.length > 0) {
    await supabase
      .from('family_members')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', toDelete);
  }
  if (members.length === 0) return;
  const rows = members.map((m, i) => ({
    user_id: userId,
    name: m.name || 'Thành viên',
    age: m.age ? parseInt(m.age, 10) : null,
    sort_order: i,
    health_conditions: m.healthConditions ?? [],
    allergies: m.allergies ? m.allergies.split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [],
  }));
  await supabase.from('family_members').insert(rows);
}

const HEALTH_TO_DB: Record<string, string> = {
  'Gout': 'gout',
  'Mỡ máu': 'mo_mau_cao',
  'Dạ dày': 'gastritis',
  'Tiểu đường': 'diabetes',
  'Huyết áp': 'hypertension',
  'Không có': 'none',
  'Suy thận': 'suy_than',
  'Gan nhiễm mỡ': 'gan_nhiem_mo',
  'Muốn giảm cân': 'beo_phi',
};

export async function updateFamilyMemberHealth(
  userId: string,
  memberId: string,
  healthConditions: string[],
  allergies: string
): Promise<void> {
  const allergiesArr = allergies
    ? allergies.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : [];
  const dbConditions = healthConditions
    .map((c) => HEALTH_TO_DB[c] ?? c)
    .filter((c) => c !== 'none');
  await supabase
    .from('family_members')
    .update({
      health_conditions: dbConditions,
      allergies: allergiesArr,
    })
    .eq('id', memberId)
    .eq('user_id', userId);
}

/** Sync health data for all family members by order (after S-03). */
export async function syncFamilyMembersHealth(
  userId: string,
  members: FamilyMemberInput[]
): Promise<void> {
  const { data: rows } = await supabase
    .from('family_members')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  if (!rows || rows.length === 0) return;
  for (let i = 0; i < Math.min(rows.length, members.length); i++) {
    const m = members[i];
    const dbConditions = (m.healthConditions ?? [])
      .map((c) => HEALTH_TO_DB[c] ?? c)
      .filter((c) => c !== 'none');
    const allergiesArr = m.allergies
      ? m.allergies.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [];
    await supabase
      .from('family_members')
      .update({ health_conditions: dbConditions, allergies: allergiesArr })
      .eq('id', rows[i].id)
      .eq('user_id', userId);
  }
}

export async function saveUserSettingsFromOnboarding(
  userId: string,
  opts: {
    cookTimeWeekdayMin?: number;
    cookTimeWeekendMin?: number;
    budgetWeekdayVnd?: number;
    budgetWeekendVnd?: number;
  }
): Promise<void> {
  await supabase.from('user_settings').upsert(
    {
      user_id: userId,
      cook_time_weekday_min: opts.cookTimeWeekdayMin ?? 30,
      cook_time_weekend_min: opts.cookTimeWeekendMin ?? 60,
      budget_weekday_vnd: opts.budgetWeekdayVnd ?? 120000,
      budget_weekend_vnd: opts.budgetWeekendVnd ?? 200000,
    },
    { onConflict: 'user_id' }
  );
}

export async function completeOnboarding(userId: string): Promise<void> {
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from('users')
    .select('trial_started_at, subscription_status')
    .eq('id', userId)
    .single();
  const startTrial =
    existing && existing.trial_started_at == null && (existing.subscription_status == null || existing.subscription_status === 'trial');
  await supabase
    .from('users')
    .update({
      onboarding_completed: true,
      updated_at: now,
      ...(startTrial && { trial_started_at: now, subscription_status: 'trial' }),
    })
    .eq('id', userId);
}
