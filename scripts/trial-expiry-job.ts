/**
 * Trial expiry job — tech-spec §17 / P2.2.
 * For users where trial_started_at + 14 days <= NOW() and subscription_status = 'trial':
 * SET subscription_status = 'expired'.
 * Run: npx tsx scripts/trial-expiry-job.ts
 * Or call POST /api/cron/trial-expiry with Authorization: Bearer <CRON_SECRET>.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const TRIAL_DAYS = 14;

const url = process.env.VITE_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function run() {
  const { data: rows, error } = await supabase
    .from('users')
    .select('id, trial_started_at')
    .eq('subscription_status', 'trial')
    .not('trial_started_at', 'is', null);

  if (error) {
    console.error('Failed to fetch users:', error.message);
    process.exit(1);
  }

  const now = Date.now();
  const trialMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const toExpire = (rows ?? []).filter((r: { trial_started_at: string }) => {
    const started = new Date(r.trial_started_at).getTime();
    return started + trialMs <= now;
  });

  let updated = 0;
  for (const row of toExpire) {
    const { error: updateErr } = await supabase
      .from('users')
      .update({ subscription_status: 'expired' })
      .eq('id', row.id);
    if (updateErr) console.error(`Failed to update user ${row.id}:`, updateErr.message);
    else updated++;
  }
  console.log(`Trial expiry job done: ${updated} users set to expired.`);
}

run();
