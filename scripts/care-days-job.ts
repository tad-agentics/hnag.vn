/**
 * Care days count job — tech-spec §17.
 * For each user: SET care_days_count = COUNT(DISTINCT meal_date) FROM meal_plans WHERE status = 'completed'.
 * Run: npx tsx scripts/care-days-job.ts
 * Or call POST /api/cron/care-days with Authorization: Bearer <CRON_SECRET>.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function run() {
  const { data: rows, error } = await supabase
    .from('meal_plans')
    .select('user_id, meal_date')
    .eq('status', 'completed');

  if (error) {
    console.error('Failed to fetch meal_plans:', error.message);
    process.exit(1);
  }

  const perUser = new Map<string, Set<string>>();
  for (const row of rows ?? []) {
    const uid = row.user_id as string;
    const date = row.meal_date as string;
    if (!perUser.has(uid)) perUser.set(uid, new Set());
    perUser.get(uid)!.add(date);
  }
  let updated = 0;
  for (const [userId, dates] of perUser) {
    const count = dates.size;
    const { error: updateErr } = await supabase
      .from('users')
      .update({ care_days_count: count })
      .eq('id', userId);
    if (updateErr) console.error(`Failed to update user ${userId}:`, updateErr.message);
    else updated++;
  }
  console.log(`Care days job done: ${updated} users updated.`);
}

run();
