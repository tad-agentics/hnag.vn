/**
 * HNAG API server — deck, swipe, meal-plan, user profile, payment.
 * Run with: pnpm run server (or tsx server/index.ts)
 * Vite proxies /api to this server in dev.
 */
import 'dotenv/config';
import { createHmac } from 'crypto';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { fetchDeck, recordSwipe, saveMealPlan } from '../src/app/lib/deck-core';

const app = new Hono();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ?? process.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

function createSupabaseWithAuth(jwt: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}

async function getUserId(c: Hono.Context): Promise<string | null> {
  const auth = c.req.header('Authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

app.use('/api/*', async (c, next) => {
  const userId = await getUserId(c);
  c.set('userId', userId);
  await next();
});

app.post('/api/deck', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { meal_type, slot_type, session_id } = body as Record<string, unknown>;
  if (!slot_type || typeof session_id !== 'string') {
    return c.json({ error: 'Missing slot_type or session_id' }, 422);
  }
  const mealType = typeof meal_type === 'string' ? meal_type : 'lunch';
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  const dishes = await fetchDeck(client, mealType, String(slot_type), 8, userId);
  return c.json({
    dishes,
    session_id: session_id as string,
    deck_size: dishes.length,
  });
});

app.post('/api/swipe', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { dish_id, direction, meal_type, slot_type, session_id, deck_position } = body as Record<
    string,
    unknown
  >;
  if (
    typeof dish_id !== 'string' ||
    typeof direction !== 'string' ||
    typeof meal_type !== 'string' ||
    typeof slot_type !== 'string' ||
    typeof session_id !== 'string' ||
    typeof deck_position !== 'number'
  ) {
    return c.json({ error: 'Missing or invalid required fields' }, 400);
  }
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  await recordSwipe(client, userId, dish_id, direction as 'right' | 'left' | 'defer', meal_type, slot_type, session_id, deck_position);
  return c.json({ recorded: true });
});

app.post('/api/meal-plan', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { meal_date, meal_type, dishes: dishesPayload } = body as Record<string, unknown>;
  if (
    typeof meal_date !== 'string' ||
    typeof meal_type !== 'string' ||
    !Array.isArray(dishesPayload)
  ) {
    return c.json({ error: 'Missing or invalid meal_date, meal_type, dishes' }, 400);
  }
  const dishes = dishesPayload.map((d: unknown) => {
    const o = d as Record<string, unknown>;
    return {
      dish_id: String(o.dish_id),
      slot_type: String(o.slot_type),
      is_auto: Boolean(o.is_auto),
    };
  });
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  await saveMealPlan(client, userId, meal_date, meal_type, dishes);
  const { data: row } = await client
    .from('meal_plans')
    .select('id')
    .eq('user_id', userId)
    .eq('meal_date', meal_date)
    .eq('meal_type', meal_type)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  const { data: profile } = await client
    .from('users')
    .select('care_days_count')
    .eq('id', userId)
    .single();
  return c.json(
    {
      meal_plan_id: row?.id ?? '',
      care_days_count: Number(profile?.care_days_count ?? 0),
    },
    201
  );
});

app.get('/api/user/profile', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  const { data, error } = await client
    .from('users')
    .select(
      'id, email, display_name, phone, avatar_url, auth_provider, onboarding_completed, subscription_status, trial_started_at, care_days_count, last_recognition_copy_key'
    )
    .eq('id', userId)
    .single();
  if (error || !data) return c.json({ error: 'Profile not found' }, 404);
  return c.json({
    id: data.id,
    email: data.email ?? null,
    display_name: data.display_name ?? null,
    phone: data.phone ?? null,
    avatar_url: data.avatar_url ?? null,
    auth_provider: data.auth_provider ?? null,
    onboarding_completed: data.onboarding_completed ?? false,
    subscription_status: data.subscription_status ?? null,
    trial_started_at: data.trial_started_at ?? null,
    care_days_count: Number(data.care_days_count ?? 0),
    last_recognition_copy_key: data.last_recognition_copy_key ?? null,
  });
});

app.put('/api/user/profile', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { display_name, email, phone } = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  if (typeof display_name === 'string') updates.display_name = display_name;
  if (typeof email === 'string') updates.email = email;
  if (typeof phone === 'string') updates.phone = phone;
  if (Object.keys(updates).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 422);
  }
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  const { data, error } = await client.from('users').update(updates).eq('id', userId).select().single();
  if (error) {
    if (error.code === '23505') return c.json({ error: 'Email already in use' }, 409);
    return c.json({ error: error.message }, 422);
  }
  return c.json({
    id: data.id,
    email: data.email ?? null,
    display_name: data.display_name ?? null,
    phone: data.phone ?? null,
    avatar_url: data.avatar_url ?? null,
    auth_provider: data.auth_provider ?? null,
    onboarding_completed: data.onboarding_completed ?? false,
    subscription_status: data.subscription_status ?? null,
    trial_started_at: data.trial_started_at ?? null,
    care_days_count: Number(data.care_days_count ?? 0),
    last_recognition_copy_key: data.last_recognition_copy_key ?? null,
  });
});

app.post('/api/user/avatar', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  const contentType = c.req.header('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) return c.json({ error: 'Expected multipart/form-data' }, 415);
  let formData: FormData;
  try {
    formData = await c.req.formData();
  } catch {
    return c.json({ error: 'Invalid form' }, 400);
  }
  const file = formData.get('file') ?? formData.get('avatar');
  if (!file || typeof file === 'string') return c.json({ error: 'Missing file' }, 400);
  const blob = file as Blob;
  if (blob.size > 5 * 1024 * 1024) return c.json({ error: 'File too large' }, 413);
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (blob.type && !allowed.includes(blob.type)) return c.json({ error: 'Unsupported format' }, 415);
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? '';
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '';
  const cdnUrl = process.env.PUBLIC_CLOUDFLARE_R2_CDN_URL ?? '';
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? '';
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? '';
  if (!accountId || !bucket || !accessKey || !secretKey || !cdnUrl) return c.json({ error: 'Server misconfigured' }, 500);
  let buffer: Buffer;
  try {
    const ab = await blob.arrayBuffer();
    buffer = Buffer.from(ab);
  } catch {
    return c.json({ error: 'Failed to read file' }, 400);
  }
  let webp: Buffer;
  try {
    webp = await sharp(buffer)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (e) {
    return c.json({ error: 'Invalid image' }, 415);
  }
  const key = `avatars/${userId}.webp`;
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    forcePathStyle: true,
  });
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: webp,
        ContentType: 'image/webp',
      })
    );
  } catch (e) {
    console.error('R2 upload failed:', e);
    return c.json({ error: 'Upload failed' }, 500);
  }
  const avatarUrl = cdnUrl.replace(/\/$/, '') + '/' + key;
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  const { error } = await client.from('users').update({ avatar_url: avatarUrl }).eq('id', userId);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ avatar_url: avatarUrl });
});

// --- Payment (PayOS) ---
const PAYOS_BASE = 'https://api-merchant.payos.vn';
const PLAN_AMOUNTS: Record<string, number> = { '6m': 990000, '12m': 1690000, lifetime: 2990000 };
const PLAN_DESCRIPTIONS: Record<string, string> = {
  '6m': 'HNAG 6 thang',
  '12m': 'HNAG 12 thang',
  lifetime: 'HNAG tron doi',
};

function payosSignature(dataStr: string, checksumKey: string): string {
  return createHmac('sha256', checksumKey).update(dataStr).digest('hex');
}

app.post('/api/payment/create-order', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const plan_type = (body as { plan_type?: string })?.plan_type;
  if (plan_type !== '6m' && plan_type !== '12m' && plan_type !== 'lifetime') {
    return c.json({ error: 'Invalid plan_type' }, 422);
  }
  const amount = PLAN_AMOUNTS[plan_type];
  const clientId = process.env.PAYOS_CLIENT_ID ?? '';
  const apiKey = process.env.PAYOS_API_KEY ?? '';
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY ?? '';
  const appUrl = process.env.APP_URL ?? process.env.VITE_APP_URL ?? 'http://localhost:5173';
  if (!clientId || !apiKey || !checksumKey) return c.json({ error: 'Server misconfigured' }, 500);

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500);
  const serviceClient = createClient(SUPABASE_URL, serviceKey);

  const { data: activeSub } = await serviceClient
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .limit(1)
    .maybeSingle();
  if (activeSub) return c.json({ error: 'Already has active subscription' }, 409);

  const orderCode = Math.floor(100000000 + Math.random() * 899999999);
  const returnUrl = `${appUrl.replace(/\/$/, '')}/api/payment/callback`;
  const cancelUrl = `${appUrl.replace(/\/$/, '')}/app/upgrade?status=cancelled`;
  const description = PLAN_DESCRIPTIONS[plan_type].slice(0, 9);

  const dataStr = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  const signature = payosSignature(dataStr, checksumKey);

  const { error: insertErr } = await serviceClient.from('subscriptions').insert({
    user_id: userId,
    plan_type,
    amount_vnd: amount,
    payos_order_id: String(orderCode),
    status: 'pending',
  });
  if (insertErr) return c.json({ error: 'Failed to create order' }, 500);

  const payosBody = {
    orderCode,
    amount,
    description,
    cancelUrl,
    returnUrl,
    signature,
  };
  const payosRes = await fetch(`${PAYOS_BASE}/v2/payment-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payosBody),
  });
  if (!payosRes.ok) {
    const errText = await payosRes.text();
    console.error('PayOS create failed:', payosRes.status, errText);
    return c.json({ error: 'Payment gateway error' }, 500);
  }
  const payosData = (await payosRes.json()) as {
    code?: string;
    data?: { checkoutUrl?: string; paymentLinkId?: string; orderCode?: number };
  };
  const checkoutUrl = payosData?.data?.checkoutUrl ?? '';
  if (!checkoutUrl) return c.json({ error: 'Invalid PayOS response' }, 500);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return c.json({
    checkout_url: checkoutUrl,
    order_id: String(payosData.data?.orderCode ?? orderCode),
    amount_vnd: amount,
    expires_at: expiresAt,
  });
});

app.post('/api/payment/webhook', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Bad request' }, 400);
  }
  const payload = body as { code?: string; success?: boolean; data?: Record<string, unknown>; signature?: string };
  const { data, signature } = payload;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY ?? '';
  if (!checksumKey) return c.json({ error: 'Server misconfigured' }, 500);
  const dataStr = JSON.stringify(data ?? {});
  const expectedSig = payosSignature(dataStr, checksumKey);
  if (signature !== expectedSig) return c.json({ error: 'invalid_signature' }, 400);

  if (payload.success !== true && payload.code !== '00') return c.json({ received: true });
  const orderCode = data?.orderCode != null ? String(data.orderCode) : null;
  if (!orderCode) return c.json({ received: true });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500);
  const serviceClient = createClient(SUPABASE_URL, serviceKey);

  const { data: existing } = await serviceClient
    .from('subscriptions')
    .select('id, user_id, plan_type')
    .eq('payos_order_id', orderCode)
    .eq('status', 'completed')
    .maybeSingle();
  if (existing) return c.json({ received: true });

  const { data: pending } = await serviceClient
    .from('subscriptions')
    .select('id, user_id, plan_type')
    .eq('payos_order_id', orderCode)
    .eq('status', 'pending')
    .maybeSingle();
  if (!pending) return c.json({ received: true });

  const plan_type = pending.plan_type as string;
  const now = new Date();
  let expires_at: string | null = null;
  if (plan_type === '6m') {
    const d = new Date(now);
    d.setMonth(d.getMonth() + 6);
    expires_at = d.toISOString();
  } else if (plan_type === '12m') {
    const d = new Date(now);
    d.setMonth(d.getMonth() + 12);
    expires_at = d.toISOString();
  }

  await serviceClient
    .from('subscriptions')
    .update({ status: 'completed', starts_at: now.toISOString(), expires_at })
    .eq('id', pending.id);
  await serviceClient
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_expires_at: expires_at,
      plan_type,
    })
    .eq('id', pending.user_id);

  return c.json({ received: true });
});

app.get('/api/payment/callback', (c) => {
  const code = c.req.query('code');
  const status = c.req.query('status');
  const appUrl = process.env.APP_URL ?? process.env.VITE_APP_URL ?? 'http://localhost:5173';
  const base = appUrl.replace(/\/$/, '');
  if (code === '00' && status === 'PAID') {
    return c.redirect(base + '/app/home', 302);
  }
  return c.redirect(base + '/app/upgrade?status=failed', 302);
});

app.get('/api/meal-plan/history', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  const filter = c.req.query('filter') ?? 'all'; // all | week | month
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);

  const now = new Date();
  let fromDate: string;
  if (filter === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    fromDate = d.toISOString().slice(0, 10);
  } else if (filter === 'month') {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    fromDate = d.toISOString().slice(0, 10);
  } else {
    fromDate = '2000-01-01';
  }
  const toDate = now.toISOString().slice(0, 10);

  const { data: plans, error } = await client
    .from('meal_plans')
    .select('id, meal_date, meal_type, status, dishes')
    .eq('user_id', userId)
    .gte('meal_date', fromDate)
    .lte('meal_date', toDate)
    .order('meal_date', { ascending: false })
    .order('meal_type', { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  const list = (plans ?? []) as Array<{
    id: string;
    meal_date: string;
    meal_type: string;
    status: string;
    dishes: Array<{ dish_id: string; slot_type?: string }>;
  }>;
  const dishIds = [...new Set(list.flatMap((p) => p.dishes?.map((d) => d.dish_id) ?? []).filter(Boolean))];
  let dishMap: Record<string, { name_vi: string; image_url: string | null }> = {};
  if (dishIds.length > 0) {
    const { data: dishes } = await client
      .from('dishes')
      .select('id, name_vi, image_url')
      .in('id', dishIds);
    dishMap = (dishes ?? []).reduce(
      (acc, d) => {
        acc[d.id] = { name_vi: d.name_vi ?? '', image_url: d.image_url ?? null };
        return acc;
      },
      {} as Record<string, { name_vi: string; image_url: string | null }>
    );
  }
  const mealTypeLabel: Record<string, string> = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
  };
  const entries = list.map((p) => ({
    id: p.id,
    meal_date: p.meal_date,
    meal_type: mealTypeLabel[p.meal_type] ?? p.meal_type,
    status: p.status,
    dishes: (p.dishes ?? []).map((d) => ({
      dish_id: d.dish_id,
      slot_type: d.slot_type,
      name_vi: dishMap[d.dish_id]?.name_vi ?? '',
      image_url: dishMap[d.dish_id]?.image_url ?? '',
    })),
  }));
  return c.json({ entries });
});

app.put('/api/meal-plan/:id/status', async (c) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ error: 'Unauthorized' }, 401);
  const id = c.req.param('id');
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const status = (body as { status?: string })?.status;
  if (status !== 'completed' && status !== 'skipped') return c.json({ error: 'Invalid status' }, 422);
  const token = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const client = createSupabaseWithAuth(token);
  const { error } = await client.from('meal_plans').update({ status }).eq('id', id).eq('user_id', userId);
  if (error) {
    if (error.code === 'PGRST116') return c.json({ error: 'Not found' }, 404);
    return c.json({ error: error.message }, 422);
  }
  return c.json({ updated: true });
});

app.post('/api/cron/care-days', async (c) => {
  const secret = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const cronSecret = process.env.CRON_SECRET ?? '';
  if (!cronSecret || secret !== cronSecret) return c.json({ error: 'Forbidden' }, 403);
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!SUPABASE_SERVICE_ROLE_KEY) return c.json({ error: 'Server misconfigured' }, 500);
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: rows, error } = await serviceClient
    .from('meal_plans')
    .select('user_id, meal_date')
    .eq('status', 'completed');
  if (error) return c.json({ error: error.message }, 500);
  const perUser = new Map<string, Set<string>>();
  for (const row of (rows ?? []) as Array<{ user_id: string; meal_date: string }>) {
    if (!perUser.has(row.user_id)) perUser.set(row.user_id, new Set());
    perUser.get(row.user_id)!.add(row.meal_date);
  }
  let updated = 0;
  for (const [userId, dates] of perUser) {
    const { error: updateErr } = await serviceClient
      .from('users')
      .update({ care_days_count: dates.size })
      .eq('id', userId);
    if (!updateErr) updated++;
  }
  return c.json({ ok: true, updated });
});

const TRIAL_DAYS = 14;

app.post('/api/cron/trial-expiry', async (c) => {
  const secret = c.req.header('Authorization')?.replace('Bearer ', '') ?? '';
  const cronSecret = process.env.CRON_SECRET ?? '';
  if (!cronSecret || secret !== cronSecret) return c.json({ error: 'Forbidden' }, 403);
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!SUPABASE_SERVICE_ROLE_KEY) return c.json({ error: 'Server misconfigured' }, 500);
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: rows, error } = await serviceClient
    .from('users')
    .select('id, trial_started_at')
    .eq('subscription_status', 'trial')
    .not('trial_started_at', 'is', null);
  if (error) return c.json({ error: error.message }, 500);
  const now = Date.now();
  const trialMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const toExpire = (rows ?? []).filter((r: { trial_started_at: string }) => {
    const started = new Date(r.trial_started_at).getTime();
    return started + trialMs <= now;
  });
  let updated = 0;
  for (const row of toExpire) {
    const { error: updateErr } = await serviceClient
      .from('users')
      .update({ subscription_status: 'expired' })
      .eq('id', row.id);
    if (!updateErr) updated++;
  }
  return c.json({ ok: true, updated });
});

const port = Number(process.env.API_PORT ?? 3001);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server listening on http://localhost:${info.port}`);
});
