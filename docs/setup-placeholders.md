# HNAG — Setup placeholders checklist

Use this file when setting up a new environment. Tick each box when the value is set in `.env.local`. Copy the block below into `.env.local` and replace each `PLACEHOLDER_...` with real values. Never commit `.env.local`.

Reference: [tech-spec.md §05b](tech-spec.md) (Environment Variables).

---

## Checklist — tick when set

**Public (browser)**

- [x] `VITE_SUPABASE_URL`
- [x] `VITE_SUPABASE_ANON_KEY`
- [x] `PUBLIC_CLOUDFLARE_R2_CDN_URL`
- [ ] `VAPID_PUBLIC_KEY`
- [ ] `PUBLIC_POSTHOG_KEY`
- [ ] `PUBLIC_POSTHOG_HOST`

**Server-only**

- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [x] `GEMINI_API_KEY`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [x] `PAYOS_CLIENT_ID`
- [x] `PAYOS_API_KEY`
- [x] `PAYOS_CHECKSUM_KEY`
- [x] `APP_URL`
- [x] `CLOUDFLARE_R2_ACCOUNT_ID`
- [x] `CLOUDFLARE_R2_ACCESS_KEY_ID`
- [x] `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- [x] `CLOUDFLARE_R2_BUCKET_NAME`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_ADDRESS`
- [ ] `VAPID_PRIVATE_KEY`
- [ ] `VAPID_SUBJECT`
- [ ] `SENTRY_DSN`
- [ ] `SUPABASE_WEBHOOK_SECRET`
- [ ] `CRON_SECRET`

**Optional / admin**

- [ ] `API_PORT`
- [ ] `NANO_BANANA_API_KEY`

**Non-env (set in dashboards)**

- [x] PayOS webhook URL
- [x] Supabase Auth redirect URL(s)

---

## Quick copy-paste block for `.env.local`

```bash
# ========== PUBLIC (Vite: VITE_ prefix) ==========
VITE_SUPABASE_URL=PLACEHOLDER_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=PLACEHOLDER_SUPABASE_ANON_KEY
PUBLIC_CLOUDFLARE_R2_CDN_URL=PLACEHOLDER_R2_CDN_URL
VAPID_PUBLIC_KEY=PLACEHOLDER_VAPID_PUBLIC
PUBLIC_POSTHOG_KEY=PLACEHOLDER_POSTHOG_KEY
PUBLIC_POSTHOG_HOST=PLACEHOLDER_POSTHOG_HOST

# ========== SERVER-ONLY ==========
SUPABASE_SERVICE_ROLE_KEY=PLACEHOLDER_SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY=PLACEHOLDER_GEMINI_API_KEY
UPSTASH_REDIS_REST_URL=PLACEHOLDER_UPSTASH_REDIS_URL
UPSTASH_REDIS_REST_TOKEN=PLACEHOLDER_UPSTASH_REDIS_TOKEN
PAYOS_CLIENT_ID=PLACEHOLDER_PAYOS_CLIENT_ID
PAYOS_API_KEY=PLACEHOLDER_PAYOS_API_KEY
PAYOS_CHECKSUM_KEY=PLACEHOLDER_PAYOS_CHECKSUM_KEY
APP_URL=PLACEHOLDER_APP_URL
CLOUDFLARE_R2_ACCOUNT_ID=PLACEHOLDER_R2_ACCOUNT_ID
CLOUDFLARE_R2_ACCESS_KEY_ID=PLACEHOLDER_R2_ACCESS_KEY
CLOUDFLARE_R2_SECRET_ACCESS_KEY=PLACEHOLDER_R2_SECRET_KEY
CLOUDFLARE_R2_BUCKET_NAME=PLACEHOLDER_R2_BUCKET_NAME
RESEND_API_KEY=PLACEHOLDER_RESEND_API_KEY
RESEND_FROM_ADDRESS=PLACEHOLDER_RESEND_FROM
VAPID_PRIVATE_KEY=PLACEHOLDER_VAPID_PRIVATE
VAPID_SUBJECT=PLACEHOLDER_VAPID_SUBJECT
SENTRY_DSN=PLACEHOLDER_SENTRY_DSN
SUPABASE_WEBHOOK_SECRET=PLACEHOLDER_SUPABASE_WEBHOOK_SECRET
CRON_SECRET=PLACEHOLDER_CRON_SECRET

# ========== OPTIONAL / ADMIN ==========
# API_PORT=3001
# NANO_BANANA_API_KEY=PLACEHOLDER_NANO_BANANA
```

---

## Per-variable reference

| Done | Variable | Where to get it | Example / note |
|:----:|----------|-----------------|----------------|
| | **Public (browser)** | | |
| ✓ | `VITE_SUPABASE_URL` | Supabase → Project Settings → API | `https://xxxxx.supabase.co` |
| ✓ | `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Long string, safe for client |
| ✓ | `PUBLIC_CLOUDFLARE_R2_CDN_URL` | R2 → Custom domain or public URL | `https://assets.hnag.vn` |
| ☐ | `VAPID_PUBLIC_KEY` | `npx web-push generate-vapid-keys` | First line of output |
| ☐ | `PUBLIC_POSTHOG_KEY` | PostHog → Project Settings | Project API key |
| ☐ | `PUBLIC_POSTHOG_HOST` | PostHog | `https://app.posthog.com` or self-hosted URL |
| | **Server-only** | | |
| ✓ | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **Secret** — never expose |
| ✓ | `GEMINI_API_KEY` | Google AI Studio → API Keys | For adaptation copy, pantry parse |
| ☐ | `UPSTASH_REDIS_REST_URL` | Upstash Console → REST API | `https://xxx.upstash.io` |
| ☐ | `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → REST API | **Secret** |
| ✓ | `PAYOS_CLIENT_ID` | PayOS Dashboard → API Keys | UUID |
| ✓ | `PAYOS_API_KEY` | PayOS Dashboard → API Keys | **Secret** |
| ✓ | `PAYOS_CHECKSUM_KEY` | PayOS Dashboard → Webhook | **Secret** — HMAC key |
| ✓ | `APP_URL` | Your app origin | Dev: `http://localhost:5173` · Prod: `https://hnag.vn` |
| ✓ | `CLOUDFLARE_R2_ACCOUNT_ID` | CF Dashboard → R2 → Overview | |
| ✓ | `CLOUDFLARE_R2_ACCESS_KEY_ID` | CF Dashboard → R2 → API Tokens | **Secret** |
| ✓ | `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | CF Dashboard → R2 → API Tokens | **Secret** |
| ✓ | `CLOUDFLARE_R2_BUCKET_NAME` | CF Dashboard → R2 | e.g. `hnag-assets` |
| ☐ | `RESEND_API_KEY` | Resend → API Keys | **Secret** |
| ☐ | `RESEND_FROM_ADDRESS` | Resend → Domains | e.g. `noreply@hnag.vn` |
| ☐ | `VAPID_PRIVATE_KEY` | Same as VAPID public (generate pair) | **Secret** |
| ☐ | `VAPID_SUBJECT` | Contact for Web Push | e.g. `mailto:admin@hnag.vn` |
| ☐ | `SENTRY_DSN` | Sentry → Project Settings → DSN | Optional |
| ☐ | `SUPABASE_WEBHOOK_SECRET` | Supabase → Webhooks | Optional |
| ☐ | `CRON_SECRET` | You generate a random string | Optional — for `POST /api/cron/care-days` and `POST /api/cron/trial-expiry` |
| | **Optional / admin** | | |
| ☐ | `API_PORT` | — | Default `3001` if unset |
| ☐ | `NANO_BANANA_API_KEY` | Nano Banana (image pipeline) | Admin/local only, never in prod env |

---

## Non-env placeholders (URLs / config to set elsewhere)

| Done | What | Where | Value to set |
|:----:|------|--------|--------------|
| ✓ | PayOS webhook URL | PayOS Dashboard → Webhook | `https://YOUR_DOMAIN/api/payment/webhook` |
| ✓ | PayOS return URL | Built from `APP_URL` | Server uses `APP_URL` + `/api/payment/callback` |
| ✓ | Supabase Auth redirect | Supabase → Auth → URL config | `https://YOUR_DOMAIN/auth/callback` (or localhost for dev) |

---

## Minimal set to run locally

- [x] `VITE_SUPABASE_URL`
- [x] `VITE_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY` (for API server + cron)
- [x] `APP_URL=http://localhost:5173`

For payment: add

- [x] `PAYOS_CLIENT_ID`
- [x] `PAYOS_API_KEY`
- [x] `PAYOS_CHECKSUM_KEY`

For avatar upload: add all

- [x] `CLOUDFLARE_R2_*` and `PUBLIC_CLOUDFLARE_R2_CDN_URL`
