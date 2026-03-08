# Hôm Nay Ăn Gì? — Technical Specification v3.1

**PWA · AI Meal Decision Engine · Vietnamese Family Cooking App**

| | |
|---|---|
| Version | 3.0 · March 2026 |
| Status | Pre-development |
| Sources | Northstar v1.1 · Wireframes PWA v4.3 · Emotional Design System · UI Design System v2 · Food Photo System v1.1 |
| Domain | hnag.vn |

---

## Changelog — v3.2

**Cursor-readiness fixes + S-11p (08/03/2026)**

- **Section 05b — Environment Variables (new):** 23 vars, Public vs Server-only, source links, edge-case notes for Nano Banana (offline only) and OAuth (Supabase Dashboard).
- **Section 04 — RLS:** All 12 tables now have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + 29 `CREATE POLICY` statements (was: only `admin_write_dishes`).
- **Section 16 — API Contracts:** 6 critical endpoints expanded to full TypeScript request/response schema + error codes. `PUT /api/user/profile` and `POST /api/user/avatar` added.
- **Section 21 — Phase 2/3:** Vague feature names replaced with concrete endpoint names + hard gate warnings.
- **Footer:** Updated to v3.1 baseline references (Health Rule Engine v2.0, Wireframes v4.4).
- **S-11p — Edit Profile:** New screen spec added to Screen Specs v1.4.

---

## Changelog — v3.1

**Health Rule Engine v2.0 merge (07/03/2026)**

- **Section 06 — Health Rule Engine:** Full replacement. 4 new conditions added (`mo_mau_cao`, `gan_nhiem_mo`, `suy_than`, `beo_phi`). Total: 9 conditions. TypeScript rule modules per condition. Multi-condition interaction matrix. `tooltip_detail_vi` field added to `RuleResult`. Pill Rendering Contract documented. Existing conditions `diabetes`, `hypertension`, `gout`, `gastritis` refined.
- **Section 04 — dishes:** +5 fields: `sat_fat_level`, `added_sugar_level`, `potassium_level`, `phosphorus_level`, `fiber_level` (all nullable enum, NULL → fallback `medium`).
- **Section 04 — family_members:** `health_conditions` enum: +`gan_nhiem_mo`, +`beo_phi` (v3.0 had mo_mau_cao, suy_than already).
- **Section 04 — dish_adaptations:** `condition` enum: +`mo_mau_cao`, +`gan_nhiem_mo`, +`suy_than`, +`beo_phi`.
- **Section 04 — blog_articles:** `category` enum: +`mo_mau_cao`, +`gan_nhiem_mo`, +`beo_phi`.
- **Section 13 — SEO Blog:** 3 new clusters (mỡ máu cao, gan nhiễm mỡ, beo_phi/giảm cân). Total blog: ~73–99 articles across 10 clusters.
- **Section 15 — S-03 Onboarding:** Health chips: 6 → 9 (thêm Gan nhiễm mỡ · Suy thận · Muốn giảm cân).
- **Screen count:** Unchanged — 40 screens.

---

## Changelog — v3.0

**v3.0 changes (March 2026 — sync with Wireframes PWA v4.3 + all northstar docs):**

- **Pantry persistence corrected**: Northstar v1.1 pillar note and Wireframes v4.3 session summary both specify Tủ Lạnh as **persistent per user profile** (not session-only as previously stated in v2.2). `pantry_items` table reinstated. Stale logic added: nudge after 3 days no update; toggle auto-disable after 5 days stale. Old "DEPRECATED" marker removed from schema.
- **Screen count**: 32 → **40 screens/states** across all groups.
- **W-07 Dinh Dưỡng Blog** — 4 variants fully spec'd (Desktop, Mobile, Logged-in, Article Detail). Schema, SEO, API, routes updated.
- **Tủ Lạnh states** — 4 distinct screen states documented: S-05+🧊 (toggle row), S-05🧊BS (bottom sheet), S-05🧊RS (re-sorted deck), S-07🧊 (summary).
- **Onboarding corrected**: S-02 = family members + tên only; S-03 = health chips (Gout · Mỡ máu · Dạ dày · Tiểu đường · Huyết áp · Không có) + free-text allergy; preferences removed from onboarding.
- **Settings defaults corrected (W-04)**: cook_time_weekday = 30 min, cook_time_weekend = 60 min, budget_weekday = 120.000đ, budget_weekend = 200.000đ.
- **Health conditions list expanded**: `family_members.health_conditions` enum now includes `mo_mau_cao` (mỡ máu cao) and `suy_than` (suy thận) in addition to previous values.
- **Button hover states** added to UI spec: Outline → `#FAEAE0`; Ghost → `#F2EAE4`; Disabled → `opacity: 0.4`.
- **W-02b merged into W-01**: not a separate screen. W-01 = unified landing with responsive breakpoint at 768px.
- **blog_articles.category** enum expanded to include `mo_mau` cluster.
- Emotional Design System principles codified as implementation constraints (see Section 08 Memory Engine).

> **v2.2 and earlier changes**: see archived version. Summary: LLM right-sizing (Sections 08b, 10), empty deck template-first approach, 2-layer health adaptation (rule engine + LLM), security hardening (HMAC webhook, input sanitization, RLS policies), dopamine/rewards system (Section 18), Ngày Chăm Sóc counter, recognition copy library.

---

## Table of Contents

1. [Product Overview & Scope](#01-product-overview--scope)
2. [Tech Stack](#02-tech-stack)
3. [System Architecture](#03-system-architecture)
4. [Database Schema](#04-database-schema)
5. [Auth System](#05-auth-system)
5b. [Environment Variables](#05b-environment-variables) ← Cursor initialization
6. [Health Rule Engine](#06-health-rule-engine)
7. [Swipe Deck & Recommendation Engine](#07-swipe-deck--recommendation-engine)
8. [Memory & Behavioral Engine](#08-memory--behavioral-engine)
9. [Trial, Paywall & Payments](#09-trial-paywall--payments)
10. [Chế Độ Tủ Lạnh — Fridge Mode](#10-chế-độ-tủ-lạnh--fridge-mode)
11. [Adaptive Cooking — LLM Gateway](#11-adaptive-cooking--llm-gateway)
12. [Food Photo Generation Pipeline](#12-food-photo-generation-pipeline)
13. [SEO Blog — W-07 Dinh Dưỡng](#13-seo-blog--w-07-dinh-dưỡng)
14. [PWA Spec & Offline](#14-pwa-spec--offline)
15. [Onboarding Screens (S-01 → S-04b)](#15-onboarding-screens-s-01--s-04b)
16. [API Endpoint Reference](#16-api-endpoint-reference)
17. [Background Jobs](#17-background-jobs)
18. [Dopamine & Rewards System (Emotional UX)](#18-dopamine--rewards-system-emotional-ux)
19. [Data Privacy & Compliance (Nghị Định 13)](#19-data-privacy--compliance-nghị-định-13)
20. [Performance Targets & Infra](#20-performance-targets--infra)
21. [Delivery Phases & Launch Gates](#21-delivery-phases--launch-gates)
22. [Risks & Mitigations](#22-risks--mitigations)

---

## 01. Product Overview & Scope

### North Star

> Trở thành công cụ mà mỗi gia đình Việt không thể tưởng tượng bữa ăn mà thiếu nó — dù nấu hay gọi.

### Problem

| # | Problem | Severity |
|---|---|---|
| P1 | Decision fatigue sau 8 tiếng làm việc — "Chiều nay nấu gì?" rơi vào thời điểm cognitive bandwidth = 0 | Primary |
| P2 | Bài toán đa biến: cân bằng bệnh lý · dị ứng · sở thích · thời gian · ngân sách của 3–4 người cùng lúc | Primary |
| P3 | Nguyên liệu trong tủ không được tận dụng — không biết nấu được gì, còn thiếu gì | Secondary |

### Core Product Pillars

**Pillar 1 — Knowledge Base Món Việt:** 300–500 món với nutritional data chuẩn hóa. Rule engine bệnh lý cứng. LLM chỉ generate ngôn ngữ, không quyết định health constraint. Ingredient mapping (bắt buộc vs. tuỳ chọn) cho Tủ Lạnh mode.

**Pillar 2 — Tinder UX — Swipe to Decide:** Mỗi bữa = stack cards ảnh món AI-gen. Quyết định trong 60 giây. Tủ Lạnh mode tích hợp trực tiếp: chọn nguyên liệu → deck re-sort tức thì.

**Pillar 3 — Family Memory Engine:** App học từ hành vi. Switching cost tăng theo thời gian. Target: Day-30 retention > 35%.

### Screen Count (v4.3) — 40 Screens/States

| Group | Screens |
|---|---|
| Web landing + auth (W-01, W-02) | 2 |
| Settings webviews (W-03..W-06) | 4 |
| Dinh Dưỡng Blog (W-07, W-07 Mobile, W-07 Logged-in, W-07b) | 4 |
| Onboarding (S-01, S-01b, S-02, S-03, S-04, S-04b) | 6 |
| Core loop (S-05, S-05+🧊, S-05🧊BS, S-05🧊RS, S-06a..d) | 5 + 4 slots = varies; core states 5 |
| Tủ Lạnh feature states (S-05+🧊, S-05🧊BS, S-05🧊RS, S-07🧊) | 4 |
| Recipe + Cooking (S-08a, S-08b, S-08c, S-08d) | 4 |
| Completion (S-09, S-09n) | 2 |
| Settings + History (S-10, S-11) | 2 |
| Paywall (S-12a, S-12b, S-12c, S-12d) | 4 |
| Rewards (S-R01, S-R02, S-R03) | 3 |
| **Total** | **40** |

### Business Model

| Plan | Price (one-time) | Per-day equiv. | Default CTA |
|---|---|---|---|
| 6 tháng | 990.000đ | ≈5.500đ | No |
| 12 tháng | 1.690.000đ | ≈4.600đ | **Yes** |
| Lifetime | 2.990.000đ | — | No |

Revenue mix assumption: 50% 12T · 30% 6T · 20% Lifetime → avg ~1.500.000đ/user. Year 1 target: 3.000 paying users = ~4,5 tỷ VND. Affiliate (ShopeeFood/Grab) activated after 1.000 users.

---

## 02. Tech Stack

| Layer | Choice | Rationale | Alt Considered |
|---|---|---|---|
| Frontend | **Astro 4 + React Islands** | SSG landing/blog (SEO critical), React SPA only in /app island, zero framework JS on public pages | Next.js 14 (more JS, less SEO-optimal) |
| Language | **TypeScript** | End-to-end type safety, LLM integration types, Rule Engine determinism | — |
| Database | **Supabase (PostgreSQL + Auth + RLS)** | Managed Postgres, built-in auth, Row Level Security — zero custom auth infra needed | PlanetScale (no row-level security) |
| Cache | **Upstash Redis** | Serverless Redis, deck cache (30 min), adaptation cache (24h), rate limit, session state | Redis Cloud |
| LLM | **Gemini 2.5 Flash** | Cost-optimal (~$0.075/1M input tokens), Vietnamese proficiency, fast (< 1s), sufficient for cooking instructions | GPT-4o-mini (OpenAI), Claude Sonnet |
| Image Gen | **Nano Banana API** | Batch-only, offline pipeline for food photos. Never called at runtime. | Midjourney v6 (manual fallback) |
| File Storage | **Cloudflare R2** | Zero egress between R2 and CF Pages (same network), food images + avatars | AWS S3 |
| Hosting / CDN | **Cloudflare Pages** | `@astrojs/cloudflare` adapter, Workers runtime, R2 integration, preview deploys per PR | Vercel |
| Push Notifications | **Web Push API (VAPID)** | No third-party SDK, Service Worker + VAPID keys, meal reminder scheduling | Firebase Cloud Messaging |
| Payments | **PayOS** | Native VN gateway: MoMo · VNPAY QR · ATM nội địa · Visa/MC, webhook one-stop | Stripe (VN friction) |
| Email | **Resend** | React Email templates, receipt + onboarding, 3.000/month free tier | SendGrid |
| Analytics | **PostHog (self-hosted)** | Swipe tracking, retention cohorts, paywall funnel, no data sharing | Mixpanel |
| Error monitoring | **Sentry** | LLM fail tracking, Rule Engine errors, webhook failures | — |

**Not building:**
- React Native / Flutter: PWA sufficient for MVP. Native = Phase 3 if Day-30 retention > 40%.
- Separate Express/Django backend: premature. Astro API Endpoints scale to Year 1 needs.

---

## 03. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  CLIENT LAYER (PWA — Astro 4 + React Islands)                    │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │
│  │ Astro pages │ │ /app/* route │ │ Service Worker (Workbox) │  │
│  │ W-01, W-02  │ │ (React SPA   │ │ Cache: profile, 50 món,  │  │
│  │ W-07 blog   │ │  island,     │ │ meal history 30d,        │  │
│  │ (SSG/ISR)   │ │  full hydra) │ │ saved recipes            │  │
│  └─────────────┘ └──────────────┘ └──────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTPS (JWT httpOnly cookie)
┌──────────────────────────────▼───────────────────────────────────┐
│  API LAYER (Astro API Endpoints — src/pages/api/*.ts)            │
│                                                                  │
│  /api/auth/*     /api/deck/*      /api/settings/*                │
│  /api/swipe/*    /api/recipe/*    /api/payment/*                 │
│  /api/memory/*   /api/pantry/*    /api/blog/*                    │
│  /api/rewards/*  /api/reports/*   /api/admin/*                   │
│                                                                  │
│  ┌────────────────────┐  ┌─────────────────────────────────┐    │
│  │  HEALTH RULE       │  │  MEMORY ENGINE                  │    │
│  │  ENGINE (TS only)  │  │  - Preference scoring           │    │
│  │  - gout_rules.ts   │  │  - Cooldown logic               │    │
│  │  - diabetes_rules  │  │  - Behavioral aggregation       │    │
│  │  - bp_rules.ts     │  │  - Family signal processing     │    │
│  │  - stomach_rules   │  └─────────────────────────────────┘    │
│  │  - kidney_rules    │                                          │
│  │  - lipid_rules     │  ┌─────────────────────────────────┐    │
│  └────────────────────┘  │  LLM GATEWAY (Gemini 2.5 Flash) │    │
│                          │  - Adaptive cooking instructions│    │
│  ┌────────────────────┐  │  - Recipe tips (personalized)   │    │
│  │  DECK GENERATOR    │  │  - Pantry NLP parsing           │    │
│  │  - dish_type filter│  │  - Redis cache 24h              │    │
│  │  - health rules    │  └─────────────────────────────────┘    │
│  │  - cooldown        │                                          │
│  │  - fridge mode     │                                          │
│  │  - budget/time     │                                          │
│  └────────────────────┘                                          │
└──────────────────────────────┬───────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
  │  Supabase    │  │  Upstash     │  │  Cloudflare R2   │
  │  PostgreSQL  │  │  Redis       │  │  Food images     │
  │  + Auth      │  │  deck cache  │  │  User avatars    │
  │  + RLS       │  │  adapt cache │  │  Static assets   │
  │              │  │  rate limit  │  └──────────────────┘
  └──────────────┘  └──────────────┘
```

### Astro Islands — Hydration Map

| Route | Screen | Rendering Mode | React Hydration | Rationale |
|---|---|---|---|---|
| `/` | W-01 Landing | SSG (build-time) | None — pure HTML/CSS | Max SEO, zero JS payload for crawlers |
| `/dang-nhap` | W-02 Auth | SSG | `client:load` — AuthModal island | Auth widget needs JS; rest static |
| `/dinh-duong/*` | W-07 Blog | SSG + CF Cache-Control | `client:visible` — personalized badge (logged-in only) | Article content = pure HTML; badge lazy-hydrates on viewport |
| `/onboarding/*` | S-01 → S-04b | SSR (server) | `client:load` — OnboardingWizard React SPA | Multi-step form state |
| `/app` | S-05 → S-12 | SSR shell + React SPA | `client:only="react"` — full app shell | Swipe gesture, real-time state, PWA offline = full React island. Astro provides shell + auth-guard only. |

> **Key Decision:** `/app` uses `client:only="react"`. Astro does not SSR app content — only auth-guard server-side then returns React SPA shell. Landing + blog are fully SSG — this is where Astro creates the biggest SEO advantage.

### Data Flow — Swipe Session

```
1. User opens app → API checks: trial_status, subscription_status
2. User selects meal (Sáng/Trưa/Tối) → POST /api/deck {meal, slot_type, session_id}
3. Deck Generator:
   a. Load family_members + health_profiles
   b. Load pantry_items (from DB if pantry_mode_enabled) or session state
   c. Run Health Rule Engine → exclude unsafe dishes per member
   d. Apply cooldown filter (tránh món đã ăn trong 5 ngày) ← BEFORE LLM
   e. LLM adaptation pre-generation (parallel, async) for action='adapt' dishes
   f. Apply preference scores from swipe history (cold start → warm → personalized)
   g. Apply Tủ Lạnh coverage scoring if pantry_mode_enabled
   h. Return top 8 cards, ranked by (fridgeTier ASC, healthWeight ASC, score DESC)
4. User swipes → POST /api/swipe (right=accept, left=skip)
5. Memory Engine updates preference scores async (does not block UI)
6. All slots done → Summary screen → POST /api/meal-plan
7. care_days_count incremented if new calendar day
8. Recognition copy selected → displayed on S-07 Summary
9. Push notification scheduled via Service Worker
```

---

## 04. Database Schema

### Schema Principles

- RLS enabled on all user-facing tables
- PK = UUID v4
- All timestamps = `timestamptz` UTC
- Soft delete (`deleted_at`) where FK integrity must be preserved (family_members, dishes)
- `is_published` / `is_active` flags on content tables — never serve until true

---

### Table: `users`

```sql
CREATE TABLE users (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                           text UNIQUE,
  phone                           text,
  display_name                    text,
  avatar_url                      text,
  auth_provider                   text CHECK (auth_provider IN ('google','facebook','phone')),

  -- Trial / subscription (denormalized cache — source of truth: subscriptions table)
  trial_started_at                timestamptz,
  subscription_status             text CHECK (subscription_status IN ('trial','active','expired')),
  subscription_expires_at         timestamptz,     -- NULL = Lifetime. Cache only — do NOT use as sole auth gate
  plan_type                       text CHECK (plan_type IN ('6m','12m','lifetime')),

  -- Onboarding
  onboarding_completed            boolean DEFAULT false,

  -- Push
  push_subscription               jsonb,

  -- Health data consent (Nghị định 13/2023)
  health_consent_given_at         timestamptz,     -- NULL = not consented; block health data collection
  health_consent_version          text,            -- e.g. "v1.0-2026-03"

  -- RTBF / deletion
  account_deletion_requested_at   timestamptz,     -- processed by background job within 30 days

  -- Admin access
  is_admin                        boolean DEFAULT false, -- ONLY set via Supabase Dashboard or service_role SQL

  -- Memory / rewards counters (denormalized for instant read)
  care_days_count                 integer DEFAULT 0,          -- add-only, never decrements
  total_meals_completed           integer DEFAULT 0,
  last_recognition_copy_key       text,                       -- prevent immediate repeat on S-07

  created_at                      timestamptz DEFAULT now(),
  updated_at                      timestamptz DEFAULT now()
);

-- is_admin RLS: admin-only write to dishes, blog_articles, dish_adaptations
CREATE POLICY admin_write_dishes ON dishes
  FOR ALL TO authenticated
  USING     ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);
-- is_admin embedded in JWT via Supabase custom claims hook.
-- NEVER expose user-facing endpoint to set is_admin.

-- RLS: users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_select_own ON users FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY users_update_own ON users FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
-- No INSERT (created by Supabase Auth trigger). No DELETE (use account_deletion_requested_at).
-- is_admin column: never writable via user-facing policy. Admin sets via service_role only.
```

> `subscription_expires_at` is a **read cache** only. All auth checks must query `subscriptions` table directly:
> ```sql
> SELECT expires_at FROM subscriptions
>   WHERE user_id = ? AND status = 'completed'
>   ORDER BY starts_at DESC LIMIT 1
> -- NULL = Lifetime. Future date = active. Past date = expired.
> ```

---

### Table: `family_members`

```sql
CREATE TABLE family_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES users(id) NOT NULL,
  name              text NOT NULL,
  role              text CHECK (role IN ('adult','child','elderly')),
  age               integer,

  -- Health data (requires health_consent_given_at != NULL before storing)
  health_conditions text[] DEFAULT '{}',
  -- Valid values: 'gout', 'diabetes', 'hypertension', 'gastritis', 'child_under3',
  --               'mo_mau_cao', 'gan_nhiem_mo', 'suy_than', 'beo_phi', 'none'
  -- v3.0: mo_mau_cao, suy_than | v3.1: gan_nhiem_mo, beo_phi

  allergies         text[] DEFAULT '{}', -- ingredient tags: tôm, đậu_phộng, sữa...
  dislikes          text[] DEFAULT '{}', -- ingredient/dish tags → pre-seeds negative scores

  is_primary        boolean DEFAULT false,
  sort_order        integer,
  created_at        timestamptz DEFAULT now(),
  deleted_at        timestamptz,  -- soft delete; RLS filters WHERE deleted_at IS NULL
                                  -- Preserves swipe_events FK integrity
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_family_members_user ON family_members(user_id) WHERE deleted_at IS NULL;

-- RLS: family_members table
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY fm_select_own ON family_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY fm_insert_own ON family_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY fm_update_own ON family_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- No hard DELETE — use soft delete (deleted_at). FK integrity with swipe_events preserved.
```

---

### Table: `dishes`

```sql
CREATE TABLE dishes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text UNIQUE NOT NULL,
  name_vi               text NOT NULL,
  dish_type             text CHECK (dish_type IN ('man','canh','rau','tinh_bot','khai_vi','trang_mieng')),
  category              text CHECK (category IN ('soup','braise','stir_fry','steam','rice','fresh')),
  -- category doubles as cooking_method for Memory Engine avoided_method queries

  -- Image pipeline
  image_url             text,           -- R2 CDN URL. NULL = chưa có ảnh; dish NOT served until ready
  image_status          text CHECK (image_status IN ('pending','generating','ready','failed')) DEFAULT 'pending',
  image_generated_at    timestamptz,    -- set on approve + upload; pipeline SKIPS if NOT NULL

  -- Time / cost
  cook_time_minutes     integer,
  prep_time_minutes     integer,
  budget_tier           text CHECK (budget_tier IN ('low','mid','high')),
  -- low < 50k · mid 50–150k · high > 150k

  -- Nutrition (Viện Dinh Dưỡng Quốc Gia source)
  calories              integer,
  protein_g             decimal(6,2),
  carb_g                decimal(6,2),
  fat_g                 decimal(6,2),
  sodium_mg             decimal(7,2),
  purine_level          text CHECK (purine_level IN ('low','medium','high')),  -- gout rule
  glycemic_index        integer,                                                -- diabetes rule

  -- v3.1: Health Rule Engine v2.0 fields (all nullable; NULL → fallback 'medium' in Rule Engine)
  sat_fat_level         text CHECK (sat_fat_level IN ('low','medium','high')),
  -- low <2g/100g (rau, cá nạc, đậu hũ); medium 2–5g/100g (thịt nạc, trứng); high >5g/100g (mỡ heo, nội tạng, dừa béo)
  -- Used by: mo_mau_cao, gan_nhiem_mo rules

  added_sugar_level     text CHECK (added_sugar_level IN ('low','medium','high')),
  -- Đường thêm vào trong nấu (không tính đường tự nhiên trong rau củ)
  -- low <5g/serving; medium 5–15g (kho tàu, canh chua ngọt); high >15g (rim ngọt, chè)
  -- Used by: gan_nhiem_mo, beo_phi rules

  potassium_level       text CHECK (potassium_level IN ('low','medium','high')),
  -- low (cơm, mì, bắp cải, bí đao); medium (thịt nạc, cà rốt); high (chuối, khoai lang, cà chua, rau bó xôi)
  -- Used by: suy_than rule (restrict) + hypertension DASH (promote). suy_than always wins.

  phosphorus_level      text CHECK (phosphorus_level IN ('low','medium','high')),
  -- low (cơm, trứng lòng trắng, dưa leo); medium (thịt nạc, cá); high (sữa, đậu phộng, hải sản khô, nội tạng)
  -- Used by: suy_than rule

  fiber_level           text CHECK (fiber_level IN ('low','medium','high')),
  -- LLM hint only — no block/caution logic. low (cơm trắng, thịt); high (rau xanh nhiều, ngũ cốc nguyên hạt)
  -- Hints for: diabetes (ăn rau trước cơm), beo_phi, mo_mau_cao

  -- Health classification
  suitable_conditions   text[] DEFAULT '{}',
  unsafe_conditions     text[] DEFAULT '{}',
  caution_conditions    text[] DEFAULT '{}',

  -- Ingredient mapping (Tủ Lạnh coverage scoring)
  ingredients_required  jsonb DEFAULT '[]',
  -- [{tag: "thit_heo", name_vi: "Thịt heo", qty: 300, unit: "g"}]
  -- MUST-HAVE for Tủ Lạnh coverage score. Tags: lowercase_no_accent underscore.
  ingredients_optional  jsonb DEFAULT '[]',
  -- [{tag, name_vi, qty, unit}] — garnish/substitutable; not counted in coverage

  -- Recipe
  steps                 jsonb DEFAULT '[]', -- [{order, description, timer_seconds}]
  tips                  text[] DEFAULT '{}',
  region                text CHECK (region IN ('north','central','south','nationwide')),

  -- Catalog
  is_published          boolean DEFAULT false,
  popularity_score      decimal(4,3) DEFAULT 0.5,
  -- 0.0–1.0, nightly recompute: right_swipes/total_swipes (90 days). COALESCE default 0.5.

  search_vector         tsvector,  -- GIN index for full-text search
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_dishes_published ON dishes(is_published, image_status, dish_type);
CREATE INDEX idx_dishes_search ON dishes USING GIN(search_vector);

-- Ingredient mapping note: ~2 weeks data work per 300 dishes.
-- Tags must match ingredient_tags master list used in /api/pantry/ingredients.

-- RLS: dishes table (public read, admin write)
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY dishes_select_published ON dishes FOR SELECT TO anon, authenticated
  USING (is_published = true AND image_status = 'ready');
-- Admin write policy already defined above (admin_write_dishes).
-- Anon can read published dishes (landing page preview card, blog inline CTAs).
```

---

### Table: `dish_adaptations`

```sql
CREATE TABLE dish_adaptations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id               uuid REFERENCES dishes(id) NOT NULL,
  condition             text CHECK (condition IN
    ('gout','diabetes','hypertension','gastritis','child_under3',
     'mo_mau_cao','gan_nhiem_mo','suy_than','beo_phi','dislike')),
  -- v3.1: +mo_mau_cao, +gan_nhiem_mo, +suy_than, +beo_phi

  trigger_reason        text NOT NULL,
  -- machine code matching Rule Engine reason: "purine_high", "sodium_high", "high_fat",
  -- "high_gi", "high_cholesterol", "high_potassium", etc.

  -- Safety envelope (dietitian-owned hard constraints; LLM must not violate)
  safety_parameters     jsonb NOT NULL DEFAULT '{}',
  -- {
  --   max_sodium_mg_per_serving: 400,
  --   protein_reduction_pct: 50,
  --   portion_max_g: 80,
  --   forbidden_ingredients: ["muoi"],
  --   required_substitutions: [{from:"com_trang", to:"com_gao_lut"}],
  --   cooking_method_override: "steam"
  -- }

  fallback_steps_vi     text[] DEFAULT '{}',
  -- Static fallback when LLM unavailable. Dietitian-written, generic.
  -- Shown with disclaimer if LLM call fails.

  llm_prompt_hint       text,
  -- Optional context for LLM: "Ưu tiên gợi ý dùng gừng/sả nếu có trong pantry để thay muối"
  -- Dietitian can guide LLM output without hardcoding copy.

  dietitian_verified    boolean DEFAULT false,
  -- Only when true: Rule Engine returns action='adapt' and LLM layer is permitted.
  -- Unverified → block/caution as before.

  verified_at           timestamptz,
  verified_by           text,  -- dietitian reviewer name — audit trail

  created_at            timestamptz DEFAULT now(),
  UNIQUE(dish_id, condition)
);

-- RLS: dish_adaptations (public read if dish is published, admin write)
ALTER TABLE dish_adaptations ENABLE ROW LEVEL SECURITY;
CREATE POLICY da_select_all ON dish_adaptations FOR SELECT TO authenticated
  USING (true);
-- Admin write: covered by admin_write_dishes policy scope — extend to dish_adaptations.
CREATE POLICY da_admin_write ON dish_adaptations FOR ALL TO authenticated
  USING     ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);
```

---

### Table: `swipe_events`

```sql
CREATE TABLE swipe_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users(id) NOT NULL,
  dish_id       uuid REFERENCES dishes(id) NOT NULL,
  direction     text CHECK (direction IN ('right','left','defer')),
  meal_type     text CHECK (meal_type IN ('breakfast','lunch','dinner')),
  slot_type     text,           -- 'mon_man_1', 'canh', 'rau', 'tinh_bot'...
  session_id    uuid NOT NULL,  -- groups swipes per meal session
  deck_position integer,        -- card rank when swiped (1 = top)
  swiped_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_swipe_user_time ON swipe_events(user_id, swiped_at DESC);
CREATE INDEX idx_swipe_dish ON swipe_events(dish_id);

-- RLS: swipe_events (user owns their own swipe history)
ALTER TABLE swipe_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY swipe_select_own ON swipe_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY swipe_insert_own ON swipe_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
-- No UPDATE or DELETE — swipe log is immutable. Memory Engine reads via service_role.
```

---

### Table: `meal_plans`

```sql
CREATE TABLE meal_plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) NOT NULL,
  meal_date   date NOT NULL,
  meal_type   text CHECK (meal_type IN ('breakfast','lunch','dinner')),
  dishes      jsonb DEFAULT '[]',
  -- [{dish_id, slot_type, is_auto}] — is_auto = true for tinh_bot auto-filled
  status      text CHECK (status IN ('planned','completed','skipped')) DEFAULT 'planned',
  notes       text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, meal_date DESC);
CREATE INDEX idx_meal_plans_status ON meal_plans(user_id, status);

-- RLS: meal_plans
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY mp_select_own ON meal_plans FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY mp_insert_own ON meal_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY mp_update_own ON meal_plans FOR UPDATE TO authenticated USING (user_id = auth.uid());
```

---

### Table: `user_preferences`

```sql
-- Composite unique: (user_id, dish_id, member_id) with NULL-safe COALESCE
CREATE TABLE user_preferences (
  user_id         uuid REFERENCES users(id) NOT NULL,
  dish_id         uuid REFERENCES dishes(id) NOT NULL,
  member_id       uuid REFERENCES family_members(id),  -- NULL = family-level signal
  score           decimal(4,3) DEFAULT 0,  -- -1.0 to 1.0, decays weekly × 0.95
  right_count     integer DEFAULT 0,
  left_count      integer DEFAULT 0,
  view_count      integer DEFAULT 0,
  -- +0.05 bonus on first view only (view_count: 0→1).
  -- Subsequent views: count retained for Memory Engine facts, no score impact.
  last_served_at  timestamptz,      -- cooldown anchor
  last_accepted_at timestamptz,
  updated_at      timestamptz DEFAULT now()
);

-- NULL-safe unique index (PostgreSQL NULL != NULL in UNIQUE constraint)
CREATE UNIQUE INDEX uq_user_preferences ON user_preferences(
  user_id, dish_id,
  COALESCE(member_id, '00000000-0000-0000-0000-000000000000'::uuid)
);

-- RLS: user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY up_select_own ON user_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY up_insert_own ON user_preferences FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY up_update_own ON user_preferences FOR UPDATE TO authenticated USING (user_id = auth.uid());
-- Memory Engine upserts via service_role (bypasses RLS) — not via user-facing API.
```

---

### Table: `user_settings`

```sql
CREATE TABLE user_settings (
  user_id               uuid PRIMARY KEY REFERENCES users(id),
  active_meals          text[] DEFAULT '{"lunch","dinner"}',
  meal_schedule         jsonb DEFAULT '{}',
  -- {dinner: {remind_at: '17:30', days: [1,2,3,4,5]}}

  -- Corrected defaults (v3.0 — from W-04 wireframe):
  budget_weekday_vnd    integer DEFAULT 120000,   -- 120.000đ
  budget_weekend_vnd    integer DEFAULT 200000,   -- 200.000đ
  cook_time_weekday_min integer DEFAULT 30,
  cook_time_weekend_min integer DEFAULT 60,

  meal_structure        jsonb DEFAULT '{}',
  -- {dinner: [{slot_type:'mon_man', count:2}, {slot_type:'canh', count:1}, {slot_type:'rau', count:1}]}
  kitchen_equipment     text[] DEFAULT '{}',
  timezone              text DEFAULT 'Asia/Ho_Chi_Minh',

  -- Tủ Lạnh
  pantry_mode_enabled   boolean DEFAULT false,
  -- Toggle preference. Mirrored to localStorage for instant read on app open. DB = source of truth.

  -- Memory Engine state flags
  memory_toast_shown          boolean DEFAULT false,  -- Touch Point A: shown once (cooldown first active)
  memory_card_last_surfaced_at timestamptz,           -- Touch Point B: 7-day re-surface cadence
  first_meal_completed_at     timestamptz,            -- trigger for S-09n notification prompt
  push_optin_state            text CHECK (push_optin_state IN ('not_asked','declined','accepted'))
                              DEFAULT 'not_asked',
  push_optin_asked_at         timestamptz,

  -- Rewards generation timestamps
  weekly_card_last_generated_at   timestamptz,
  monthly_report_last_generated_at timestamptz
);

-- RLS: user_settings (1:1 with users)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY us_select_own ON user_settings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY us_insert_own ON user_settings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY us_update_own ON user_settings FOR UPDATE TO authenticated USING (user_id = auth.uid());
-- Created on first login by server-side trigger with defaults. User cannot delete.
```

---

### Table: `pantry_items`

> **v3.0: REINSTATED as persistent.** Northstar v1.1 + Wireframes v4.3 specify Tủ Lạnh as persistent per user profile. Session-only decision in v2.2 was incorrect — reversed here.

```sql
CREATE TABLE pantry_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) NOT NULL,
  ingredient_tag   text NOT NULL,   -- normalized: "thit_heo", "ca_chua", "trung_ga"
  name_vi          text NOT NULL,   -- display: "Thịt heo", "Cà chua"
  quantity_note    text,            -- free text: "300g", "2 quả" — display only, not parsed
  added_at         timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  UNIQUE(user_id, ingredient_tag)
);

CREATE INDEX idx_pantry_user ON pantry_items(user_id, added_at DESC);

-- Stale logic (enforced by background job + client-side):
-- NUDGE: if MAX(updated_at) < NOW() - 3 days AND pantry_items.count > 0
--   → show banner on S-05: "Tủ lạnh cập nhật lần cuối 3 ngày trước — cập nhật lại?"
-- AUTO-DISABLE toggle: if MAX(updated_at) < NOW() - 5 days
--   → user_settings.pantry_mode_enabled = false; toast: "Tủ Lạnh đã tắt — nguyên liệu cũ hơn 5 ngày"
--   → user must re-open bottom sheet and tap "Áp dụng" to re-enable

-- RLS: pantry_items
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY pantry_select_own ON pantry_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY pantry_insert_own ON pantry_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY pantry_update_own ON pantry_items FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY pantry_delete_own ON pantry_items FOR DELETE TO authenticated USING (user_id = auth.uid());
```

---

### Table: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid REFERENCES users(id) NOT NULL,
  plan_type             text CHECK (plan_type IN ('6m','12m','lifetime')),
  amount_vnd            integer NOT NULL,
  payment_method        text CHECK (payment_method IN ('momo','vnpay','atm','visa_mc')),
  payos_order_id        text UNIQUE,
  payos_transaction_id  text,
  status                text CHECK (status IN ('pending','completed','failed','refunded')),
  starts_at             timestamptz,
  expires_at            timestamptz,  -- NULL = Lifetime (perpetual access). All auth: treat NULL as active.
  receipt_email_sent    boolean DEFAULT false,
  created_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, starts_at DESC);

-- RLS: subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sub_select_own ON subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
-- INSERT/UPDATE only via service_role (webhook handler) — no user-facing write.
-- This prevents client from inserting fake subscription records.
```

---

### Table: `blog_articles`

```sql
CREATE TABLE blog_articles (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  title_vi            text NOT NULL,
  meta_description    text,
  content_mdx         text,  -- MDX with internal links to app
  category            text CHECK (category IN
    ('gout','diabetes','hypertension','gastritis',
     'mo_mau_cao','gan_nhiem_mo','beo_phi','tre_em','general')),
  -- v3.0: 'mo_mau' → v3.1 renamed to 'mo_mau_cao' for consistency with Rule Engine code
  -- v3.1: +gan_nhiem_mo, +beo_phi, +tre_em | suy_than: no SEO cluster (clinical intent, not HNAG territory)

  health_tags         text[] DEFAULT '{}',
  featured_image_url  text,
  read_time_minutes   integer,
  is_published        boolean DEFAULT false,
  published_at        timestamptz,

  author_name         text,      -- "Bs. Nguyễn Thị X" hoặc "Đội ngũ Hôm Nay Ăn Gì?"
  reviewed_by         text,      -- dietitian reviewer name → renders "Được kiểm duyệt bởi [name]" badge
  last_reviewed_at    timestamptz, -- E-E-A-T signal: "Cập nhật: [date]" shown on article

  search_vector       tsvector,  -- GIN index

  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_blog_published ON blog_articles(is_published, published_at DESC);
CREATE INDEX idx_blog_search ON blog_articles USING GIN(search_vector);
CREATE INDEX idx_blog_category ON blog_articles(category) WHERE is_published = true;

-- RLS: blog_articles (public read for published; admin write)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY blog_select_published ON blog_articles FOR SELECT TO anon, authenticated
  USING (is_published = true);
CREATE POLICY blog_admin_write ON blog_articles FOR ALL TO authenticated
  USING     ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);
```

---

### Table: `family_reports` (Phase 2)

```sql
CREATE TABLE family_reports (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) NOT NULL,
  report_type      text CHECK (report_type IN ('weekly','monthly')),
  period_label     text NOT NULL,   -- "Tuần 10/2026", "Tháng 3/2026"
  data_snapshot    jsonb NOT NULL,
  -- {care_days, total_meals, distinct_dishes, health_violations: 0, fridge_uses, top_dish}
  image_url        text,            -- R2 PNG URL after render (Cloudflare Worker + Canvas)
  caption_default  text,            -- auto-generated share caption
  created_at       timestamptz DEFAULT now()
  -- Reports are immutable once generated — no UPDATE allowed
);

-- RLS: family_reports (Phase 2)
ALTER TABLE family_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY fr_select_own ON family_reports FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY fr_delete_own ON family_reports FOR DELETE TO authenticated USING (user_id = auth.uid());
-- INSERT only via service_role (background report generation job). No user-facing INSERT or UPDATE.
CREATE INDEX idx_family_reports_user ON family_reports(user_id, created_at DESC);
```

---

### Schema Summary — Table Relationships

```
users (1) ──< family_members (many)
users (1) ──< user_settings (1)
users (1) ──< pantry_items (many)        ← v3.0: persistent
users (1) ──< subscriptions (many)
users (1) ──< swipe_events (many)
users (1) ──< meal_plans (many)
users (1) ──< user_preferences (many)
users (1) ──< family_reports (many)
dishes (1) ──< dish_adaptations (many)
dishes (1) ──< swipe_events (many)
dishes (1) ──< user_preferences (many)
```

---

## 05. Auth System

### Auth Methods

| Method | Implementation | UX |
|---|---|---|
| Google OAuth 2.0 | Supabase Auth built-in. Flow: consent screen → `/auth/callback` → set httpOnly JWT cookie → redirect `/onboarding` or `/app` | Primary CTA: "Tiếp tục với Google" |
| Facebook Login | Supabase Auth + Facebook provider. Scopes: email + public_profile. Same callback flow. | Secondary option, same modal |
| Phone OTP | Supabase Phone Auth → Twilio SMS. Input SĐT VN (+84) → 6-digit OTP → verify. Retry max 3×. | Fallback for social auth aversion |

### Session Management

```typescript
// JWT config (Supabase handles signing)
Token type: JWT
Storage: httpOnly cookie (not localStorage — XSS protection)
Cookie flags: HttpOnly; Secure; SameSite=Lax
// SameSite=Lax: protects state-changing POST endpoints against CSRF
// without requiring separate CSRF tokens — sufficient for this threat model.
// Verify SameSite=Lax is set on auth callback in staging before production deploy.
Expiry: 30 days with auto-refresh
Refresh strategy: silent refresh 5 min before expire
Logout: clear cookie + Supabase session revoke

// New user routing
Auth success → check users table → is_new?
  → YES: redirect /onboarding (S-01)
  → NO (trial_active or paid): redirect /app (S-05)
  → NO (trial_expired): redirect /app → hard gate S-12c
```

### Auth Check — Source of Truth Query

```sql
-- Always query subscriptions, never rely solely on users.subscription_expires_at
SELECT expires_at FROM subscriptions
  WHERE user_id = $1 AND status = 'completed'
  ORDER BY starts_at DESC LIMIT 1
-- NULL result: no active subscription → check trial_started_at
-- expires_at IS NULL: Lifetime access → allow
-- expires_at > NOW(): active → allow
-- expires_at <= NOW(): expired → gate
```

---

## 05b. Environment Variables

All variables required to initialize the stack. Missing any of these = runtime failure on first run.

**Rules:**
- `NEXT_PUBLIC_` / `PUBLIC_` prefixed vars are exposed to the browser — never put secrets here
- All LLM, payment, storage, and service keys are server-side only — no `PUBLIC_` prefix
- Astro uses `PUBLIC_` prefix (not `NEXT_PUBLIC_`) for client-exposed vars
- A `.env.example` entry must exist for every variable with value redacted

| Variable | Public? | Required | Description | Where to get it |
|---|---|---|---|---|
| `PUBLIC_SUPABASE_URL` | ✅ Browser | Yes | Supabase project URL | Supabase → Project Settings → API |
| `PUBLIC_SUPABASE_ANON_KEY` | ✅ Browser | Yes | Supabase public anon key — safe to expose | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 Server | Yes | Bypasses RLS — server-side only. Never reference in client components | Supabase → Project Settings → API |
| `GEMINI_API_KEY` | 🔒 Server | Yes | Gemini 2.5 Flash — LLM gateway (adaptation copy + NLP parsing) | Google AI Studio → API Keys |
| `UPSTASH_REDIS_REST_URL` | 🔒 Server | Yes | Upstash Redis REST endpoint — deck cache, adaptation cache, rate limit | Upstash → Console → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | 🔒 Server | Yes | Upstash Redis auth token | Upstash → Console → REST API |
| `PAYOS_CLIENT_ID` | 🔒 Server | Yes | PayOS merchant client ID | PayOS Dashboard → API Keys |
| `PAYOS_API_KEY` | 🔒 Server | Yes | PayOS API key for order creation | PayOS Dashboard → API Keys |
| `PAYOS_CHECKSUM_KEY` | 🔒 Server | Yes | HMAC-SHA256 secret for webhook signature verification | PayOS Dashboard → Webhook |
| `CLOUDFLARE_R2_ACCOUNT_ID` | 🔒 Server | Yes | R2 account identifier | CF Dashboard → R2 → Overview |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | 🔒 Server | Yes | R2 access key (write access for image pipeline) | CF Dashboard → R2 → API Tokens |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | 🔒 Server | Yes | R2 secret key | CF Dashboard → R2 → API Tokens |
| `CLOUDFLARE_R2_BUCKET_NAME` | 🔒 Server | Yes | R2 bucket name (e.g. `hnag-assets`) | CF Dashboard → R2 |
| `PUBLIC_CLOUDFLARE_R2_CDN_URL` | ✅ Browser | Yes | Public CDN URL for R2 bucket (e.g. `https://assets.hnag.vn`) — used to construct `image_url` for dish cards | CF Dashboard → R2 → Custom Domain |
| `RESEND_API_KEY` | 🔒 Server | Yes | Resend email API key — receipts + onboarding emails | Resend → API Keys |
| `RESEND_FROM_ADDRESS` | 🔒 Server | Yes | Sender address (e.g. `noreply@hnag.vn`) | Resend → Domains |
| `VAPID_PUBLIC_KEY` | ✅ Browser | Yes | Web Push VAPID public key — required by Service Worker | Generate with `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | 🔒 Server | Yes | Web Push VAPID private key — signs push subscriptions | Same as above |
| `VAPID_SUBJECT` | 🔒 Server | Yes | VAPID contact URI (e.g. `mailto:admin@hnag.vn`) | Define manually |
| `SENTRY_DSN` | 🔒 Server | Yes | Sentry error tracking DSN — LLM failures, Rule Engine errors, webhook failures | Sentry → Project Settings |
| `PUBLIC_POSTHOG_KEY` | ✅ Browser | Yes | PostHog project API key — swipe analytics, retention cohorts | PostHog → Project Settings |
| `PUBLIC_POSTHOG_HOST` | ✅ Browser | Yes | PostHog host URL (self-hosted or `https://app.posthog.com`) | PostHog → Project Settings |
| `SUPABASE_WEBHOOK_SECRET` | 🔒 Server | No | Secret for Supabase DB webhook auth (Background Jobs) | Supabase → Webhooks → Secret |

> **Image pipeline only (admin/local):** `NANO_BANANA_API_KEY` — never needed at runtime. Store in `.env.local` only, never in Cloudflare Pages environment. Food photo generation is an offline admin-only operation.

> **OAuth (Supabase handles redirect URLs):** Google and Facebook OAuth secrets are configured directly in Supabase Auth dashboard — not needed as local env vars. Supabase Auth manages the OAuth flow internally.

---

## 06. Health Rule Engine

> **Hard Constraint — non-negotiable:** LLM cannot make health constraint decisions. Rule Engine is a deterministic TypeScript module — 100% test coverage, zero AI calls. LLM is permitted only to generate adaptation copy *after* a dish has already passed the Rule Engine. Target accuracy: ≥ 85% per Viện Dinh Dưỡng Quốc Gia guidelines. Source authorities: Bộ Y tế VN, WHO, ADA 2023, ESC 2021, KDIGO 2024, AASLD/EASL 2023.

### Conditions Covered (v3.1 — 9 Conditions)

| Mã | Tên | Phiên bản | Key Signals | Block Trigger | Adapt Trigger |
|---|---|---|---|---|---|
| `gout` | Gout (tăng acid uric) | v1.0 | `purine_level` | high + no adaptation | medium/high + verified adaptation |
| `diabetes` | Tiểu đường type 2 | v1.0 | `glycemic_index`, `fiber_level` | GI ≥ 70 + no adaptation | GI 55–69 OR adapted low-GI sub available |
| `hypertension` | Huyết áp cao | v1.0 | `sodium_mg` | sodium_mg > 800/serving + no adaptation | 400–800mg + verified low-salt version |
| `gastritis` | Dạ dày / Trào ngược | v1.0 | `category`, ingredients | fried/spicy/acidic + no adaptation | adapted cooking method available |
| `child_under3` | Trẻ dưới 3 tuổi | v1.0 | `sodium_mg`, texture flags | high sodium OR hard texture | adapted no-salt / soft texture version |
| `mo_mau_cao` | Rối loạn lipid máu | v3.1 | `sat_fat_level`, `fat_g` | sat_fat_level = high + no adaptation | sat_fat_level = medium + verified low-fat prep |
| `gan_nhiem_mo` | Gan nhiễm mỡ (NAFLD) | v3.1 | `sat_fat_level`, `added_sugar_level` | both high + no adaptation | either medium + adaptation available |
| `suy_than` | Suy thận mạn (CKD 3–4) | v3.1 | `potassium_level`, `phosphorus_level`, `protein_g` | potassium_level = high OR phosphorus_level = high | protein_g high → portion reduction adaptation |
| `beo_phi` | Thừa cân / Béo phì | v3.1 | `calories`, `added_sugar_level`, `fat_g` | no hard block — calorie-dense dishes → caution | high-calorie + adaptation for portion/substitution |

> **`beo_phi` design decision:** No hard block. Over-restriction triggers resistance and shame. Strategy: caution + portion adapt + promote fiber/vegetable dishes. LLM hint: suggest adding vegetables, reduce portion, not prohibit dish entirely.

---

### Rule Result Type (v3.1)

```typescript
// lib/rules/types.ts

type SafetyParameters = {
  // Portion & macro limits
  max_sodium_mg_per_serving?: number;
  protein_reduction_pct?: number;
  portion_max_g?: number;
  max_cholesterol_mg?: number;
  max_potassium_mg_per_serving?: number;   // suy_than
  max_phosphorus_mg_per_serving?: number;  // suy_than
  max_sat_fat_g_per_serving?: number;      // mo_mau_cao, gan_nhiem_mo
  max_added_sugar_g_per_serving?: number;  // gan_nhiem_mo, beo_phi
  max_calories_per_serving?: number;       // beo_phi

  // Ingredient & method overrides
  forbidden_ingredients?: string[];
  required_substitutions?: { from: string; to: string }[];
  cooking_method_override?: string;
};

type RuleResult = {
  action: 'allow' | 'adapt' | 'caution' | 'block';
  reason?: string;               // machine code → matches dish_adaptations.trigger_reason
  tooltip_vi?: string;           // pill label: 'Dùng lượng nhỏ' (caution only — always this string)
  tooltip_detail_vi?: string;    // tap detail: short reason e.g. 'Cholesterol trung bình' (v3.1)
  // Populated only when action = 'adapt':
  safety_parameters?: SafetyParameters;
  fallback_steps_vi?: string[];
  llm_prompt_hint?: string | null;
  adaptation?: { label_vi: string; steps_vi: string[] };
  member_name?: string;
};

// tooltip_detail_vi usage:
// - Frontend: if tooltip_detail_vi present → render caret icon on caution pill → show detail on tap
// - Backward compatible: field optional; undefined = no detail, no caret
```

---

### Pill Rendering Contract

| Action | Pill Label | Tap Behavior |
|---|---|---|
| `allow` | No pill | — |
| `adapt` | 🔧 `"Điều chỉnh cho {memberName}"` | Opens bottom sheet with per-member adaptation steps. **Exception:** `beo_phi` → `"Điều chỉnh phần — bữa nhẹ hơn"` (no member name — avoids stigma) |
| `caution` | ⚠ `"Dùng lượng nhỏ"` (fixed string, never changes) | Shows `tooltip_detail_vi` if present |
| `block` | Never rendered in user UI | `tooltip_vi` = full reason for admin/logging only |

> **adapt exception for `beo_phi`:** Never inject member name into adapt pill for obesity condition. Use fixed copy `"Điều chỉnh phần — bữa nhẹ hơn"`. Avoids surfacing weight-related labels tied to a specific person.

---

### Per-Condition Rule Modules

```typescript
// lib/rules/conditions/ — one file per condition

// --- gout.ts ---
export function evaluateGout(dish: Dish): RuleResult {
  if (dish.purine_level === 'high') {
    const adaptation = getAdaptation(dish.id, 'gout');
    if (!adaptation?.dietitian_verified) return { action: 'block', reason: 'purine_high' };
    return { action: 'adapt', reason: 'purine_high', ...buildAdaptResult(adaptation) };
  }
  if (dish.purine_level === 'medium') {
    const adaptation = getAdaptation(dish.id, 'gout');
    if (adaptation?.dietitian_verified) return { action: 'adapt', reason: 'purine_medium', ...buildAdaptResult(adaptation) };
    return { action: 'caution', reason: 'purine_medium',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Nhân purin trung bình' };
  }
  return { action: 'allow' };
}

// --- diabetes.ts ---
export function evaluateDiabetes(dish: Dish): RuleResult {
  const gi = dish.glycemic_index ?? 55; // NULL → treat as medium GI
  if (gi >= 70) {
    const adaptation = getAdaptation(dish.id, 'diabetes');
    if (!adaptation?.dietitian_verified) return { action: 'block', reason: 'high_gi' };
    return { action: 'adapt', reason: 'high_gi', ...buildAdaptResult(adaptation) };
  }
  if (gi >= 55) {
    return { action: 'caution', reason: 'medium_gi',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'GI trung bình — ăn rau trước cơm' };
  }
  return { action: 'allow' };
}

// --- hypertension.ts ---
export function evaluateHypertension(dish: Dish): RuleResult {
  const sodium = dish.sodium_mg ?? 0;
  if (sodium > 800) {
    const adaptation = getAdaptation(dish.id, 'hypertension');
    if (!adaptation?.dietitian_verified) return { action: 'block', reason: 'sodium_high' };
    return { action: 'adapt', reason: 'sodium_high', ...buildAdaptResult(adaptation) };
  }
  if (sodium > 400) {
    const adaptation = getAdaptation(dish.id, 'hypertension');
    if (adaptation?.dietitian_verified) return { action: 'adapt', reason: 'sodium_medium', ...buildAdaptResult(adaptation) };
    return { action: 'caution', reason: 'sodium_medium',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Muối/natri trung bình' };
  }
  return { action: 'allow' };
}

// --- mo_mau_cao.ts ---
export function evaluateMoMauCao(dish: Dish): RuleResult {
  const sat = dish.sat_fat_level ?? 'medium'; // NULL fallback: conservative
  if (sat === 'high') {
    const adaptation = getAdaptation(dish.id, 'mo_mau_cao');
    if (!adaptation?.dietitian_verified) return { action: 'block', reason: 'sat_fat_high' };
    return { action: 'adapt', reason: 'sat_fat_high', ...buildAdaptResult(adaptation) };
  }
  if (sat === 'medium') {
    const adaptation = getAdaptation(dish.id, 'mo_mau_cao');
    if (adaptation?.dietitian_verified) return { action: 'adapt', reason: 'sat_fat_medium', ...buildAdaptResult(adaptation) };
    return { action: 'caution', reason: 'sat_fat_medium',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Cholesterol trung bình' };
  }
  return { action: 'allow' };
}

// --- gan_nhiem_mo.ts ---
export function evaluateGanNhiemMo(dish: Dish): RuleResult {
  const sat = dish.sat_fat_level ?? 'medium';
  const sugar = dish.added_sugar_level ?? 'medium';
  if (sat === 'high' && sugar === 'high') {
    const adaptation = getAdaptation(dish.id, 'gan_nhiem_mo');
    if (!adaptation?.dietitian_verified) return { action: 'block', reason: 'high_fat_high_sugar' };
    return { action: 'adapt', reason: 'high_fat_high_sugar', ...buildAdaptResult(adaptation) };
  }
  if (sat === 'high' || sugar === 'high') {
    const adaptation = getAdaptation(dish.id, 'gan_nhiem_mo');
    if (adaptation?.dietitian_verified) return { action: 'adapt', reason: sat === 'high' ? 'sat_fat_high' : 'added_sugar_high', ...buildAdaptResult(adaptation) };
    return { action: 'caution', reason: 'fat_or_sugar_elevated',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Tinh bột/đường trung bình' };
  }
  return { action: 'allow' };
}

// --- suy_than.ts ---
export function evaluateSuyThan(dish: Dish): RuleResult {
  const K = dish.potassium_level ?? 'medium';
  const P = dish.phosphorus_level ?? 'medium';
  const protein = dish.protein_g ?? 0;

  // Hard block: high K or high P — no adaptation bypasses this
  if (K === 'high') return { action: 'block', reason: 'potassium_high',
    tooltip_vi: 'Kali cao — không phù hợp người suy thận' };
  if (P === 'high') return { action: 'block', reason: 'phosphorus_high',
    tooltip_vi: 'Phốt pho cao — không phù hợp người suy thận' };

  // Protein: caution or adapt
  if (protein > 20) { // g per serving — threshold per KDIGO CKD stage 3-4
    const adaptation = getAdaptation(dish.id, 'suy_than');
    if (adaptation?.dietitian_verified) return { action: 'adapt', reason: 'protein_high', ...buildAdaptResult(adaptation) };
    return { action: 'caution', reason: 'protein_elevated',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Đạm cao — ăn nửa phần' };
  }
  if (K === 'medium' || P === 'medium') {
    return { action: 'caution', reason: 'kp_medium',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Muối/kali trung bình' };
  }
  return { action: 'allow' };
}

// --- beo_phi.ts ---
export function evaluateBeophi(dish: Dish): RuleResult {
  const calories = dish.calories ?? 0;
  const sugar = dish.added_sugar_level ?? 'low';

  // No hard block for beo_phi — always caution or adapt
  if (calories > 600 || sugar === 'high') {
    const adaptation = getAdaptation(dish.id, 'beo_phi');
    if (adaptation?.dietitian_verified) return {
      action: 'adapt', reason: calories > 600 ? 'high_calorie' : 'high_sugar',
      // beo_phi adapt: NO member_name injection — use fixed copy
      ...buildAdaptResult(adaptation, { suppressMemberName: true })
    };
    return { action: 'caution', reason: 'calorie_dense',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Năng lượng cao' };
  }
  if (calories > 400) {
    return { action: 'caution', reason: 'moderate_calorie_dense',
             tooltip_vi: 'Dùng lượng nhỏ', tooltip_detail_vi: 'Ăn vừa phần, thêm rau trước' };
  }
  return { action: 'allow' };
}
```

---

### Family Aggregation Logic

```typescript
// lib/rules/engine.ts

function aggregateResults(results: MemberRuleResult[]): FamilyRuleResult {
  const hasBlock  = results.some(r => r.action === 'block');
  const adaptions = results.filter(r => r.action === 'adapt');
  const cautions  = results.filter(r => r.action === 'caution');

  // One block = whole dish blocked. No exceptions. Health rules are never relaxed.
  if (hasBlock) return { action: 'block' };
  if (adaptions.length > 0) return {
    action: 'adapt',
    adapt_contexts: adaptions.map(r => ({
      member_name: r.member_name,
      reason: r.reason,
      safety_parameters: r.safety_parameters,
      fallback_steps_vi: r.fallback_steps_vi,
      llm_prompt_hint: r.llm_prompt_hint,
    }))
  };
  if (cautions.length > 0) return { action: 'caution', cautions };
  return { action: 'allow' };
}
```

---

### Multi-Condition Interaction Matrix

When a member has multiple conditions, rules run independently per condition and `aggregateResults` merges. Exceptions:

| Condition pair | Special handling |
|---|---|
| `suy_than` + `gout` | suy_than block on K/P overrides all. Gout purine rules still run independently — worst result wins. |
| `suy_than` + `hypertension` | Both run. suy_than block always wins. Hypertension sodium caution preserved if suy_than allows. |
| `diabetes` + `beo_phi` | Both run. No conflict — diabetes GI rules + beo_phi calorie rules both surface. |
| `mo_mau_cao` + `gan_nhiem_mo` | Both run independently. If both produce `block` → one block returned. If both `adapt` → separate entries in `adapt_contexts`. |
| Any condition + `beo_phi` | `beo_phi` never blocks. If another condition blocks → block wins. `beo_phi` adapt only appears if no other condition also adapts same dish (to avoid pill overload — show the more clinically severe adapt context). |

> **Rule:** Clinically severe condition always overrides. Priority: `suy_than` > `gout` > `diabetes` > `hypertension` > `gastritis` > `mo_mau_cao` > `gan_nhiem_mo` > `beo_phi` for tie-breaking adapt_context display.

---

### Dish Health UI on Swipe Card

| Rule Result | Card Badge | Tap Action |
|---|---|---|
| `allow` | No badge | — |
| `adapt` | 🔧 amber pill — see Pill Rendering Contract above | Bottom sheet: per-member adaptation steps |
| `caution` | ⚠ amber pill `"Dùng lượng nhỏ"` + caret if `tooltip_detail_vi` present | Tap: shows `tooltip_detail_vi` |
| `block` | Never shown — filtered from deck before rendering | — |

**Onboarding trust signal (first card, S-01b):**
- Rule Engine `allow` → green pill `"✓ [Tên] (Gout OK)"`
- `action=adapt` → amber pill `"✓ [Tên] (Gout · điều chỉnh)"`
- Shown only for members with `health_conditions ≠ ['none']`

---

### Adaptation Data Scope

| Phase | Scope | Records |
|---|---|---|
| Phase 1 | 50 dishes × 4 original conditions (gout, diabetes, hypertension, gastritis) | ~200 records |
| Phase 1b | 50 dishes × 4 new conditions (mo_mau_cao, gan_nhiem_mo, suy_than, beo_phi) | ~200 records |
| **Total Phase 1** | 50 dishes × 8 conditions | **~400 records** |

> Data labeling: dietitian-owned. 5 new dish fields × 300 dishes = 1,500 data points. Prioritize 50 most popular dishes first (~250 points, ~1 week). NULL fallback (`medium`) keeps app functional during labeling.

---

## 07. Swipe Deck & Recommendation Engine

### DishCard Type

```typescript
type DishCard = {
  id: string;
  name_vi: string;
  image_url: string;           // R2 CDN, always image_status='ready'
  cook_time_minutes: number;
  budget_tier: 'low' | 'mid' | 'high';
  healthAction: 'allow' | 'adapt' | 'caution'; // drives badge rendering
  healthTooltip?: string;
  memberAdaptations: {
    member_name: string;
    label_vi: string;
    steps_vi: string[];
    substitutions?: { from_name_vi: string; to_name_vi: string; ratio_note?: string }[];
    portion_note?: string;
  }[];
  fridgeTier?: 0 | 1;          // undefined = fridge mode inactive
  missingIngredients?: string[]; // name_vi list for Tier 1 badge
  score: number;               // 0–1 for deck sorting
};
```

### Deck Generation Algorithm

```typescript
async function generateDeck(
  userId: string, mealType: MealType, slotType: SlotType, options: DeckOptions
): Promise<DishCard[]> {

  // Step 1: Cache check
  // Key includes pantry hash if fridge mode active
  const pantryHash = options.pantryMode
    ? await computePantryHash(userId) // reads from pantry_items DB
    : null;
  const cacheKey = pantryHash
    ? `deck:${userId}:${mealType}:${slotType}:${pantryHash}`
    : `deck:${userId}:${mealType}:${slotType}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // Step 2: Base filter from DB
  let candidates = await db.dishes.findMany({
    where: {
      dish_type: slotType,
      budget_tier: { in: allowedTiers(options.budget) },
      cook_time_minutes: { lte: options.maxCookTime },
      is_published: true,
      image_status: 'ready',  // never serve dishes without approved photos
    }
  });

  // Step 3a: Health Rule Engine (Layer 1) — DETERMINISTIC, NO LLM
  const ruleResults = await Promise.all(
    candidates.map(async dish => ({
      dish,
      ruleResult: await evaluateDishForFamily(dish, options.familyMembers, db)
    }))
  );
  let passed = ruleResults.filter(({ ruleResult }) => ruleResult.action !== 'block');

  // Step 3b: Cooldown filter — BEFORE LLM (avoid wasted LLM calls on cooled-down dishes)
  const recentDishes = await getRecentMealPlanDishes(userId, days=5);
  passed = passed.filter(({ dish }) => !recentDishes.includes(dish.id));

  // Step 3c: LLM adaptation pre-generation (Layer 2) — parallel, async
  // Pre-generates and caches BEFORE user taps badge → zero latency on bottom sheet open
  const adaptDishes = passed.filter(({ ruleResult }) => ruleResult.action === 'adapt');
  const adaptResults = await Promise.all(
    adaptDishes.map(async ({ dish, ruleResult }) => ({
      dish_id: dish.id,
      memberAdaptations: await generateAdaptation(
        dish, ruleResult.adapt_contexts, options.familyContext,
        options.pantryItems ?? [], db, redis
      )
    }))
  );
  const adaptMap = Object.fromEntries(adaptResults.map(r => [r.dish_id, r.memberAdaptations]));

  candidates = passed.map(({ dish, ruleResult }) => ({
    ...dish,
    healthAction: ruleResult.action,
    memberAdaptations: adaptMap[dish.id] ?? [],
    healthTooltip: ruleResult.tooltip_vi ?? null
  }));

  // Step 4: Preference scoring — cold start → warm → personalized
  const prefs = await getUserPreferences(userId);
  const totalSwipes = await getSwipeCount(userId);

  candidates = candidates.map(d => {
    const personalScore = prefs[d.id]?.score;
    let score: number;

    if (totalSwipes < 10) {
      // COLD START: popularity-dominant (global signal)
      score = d.popularity_score * 0.8 + (personalScore ?? d.popularity_score) * 0.2;
    } else if (totalSwipes < 30) {
      // WARMING UP: linear blend toward personal
      const weight = (totalSwipes - 10) / 20; // 0.0 at 10 → 1.0 at 30
      score = d.popularity_score * (1 - weight) + (personalScore ?? d.popularity_score) * weight;
    } else {
      // PERSONALIZED: fully personal
      score = personalScore ?? d.popularity_score;
    }

    // Recipe view bonus: +0.05 on first view only
    const viewBonus = (prefs[d.id]?.view_count ?? 0) >= 1 ? 0.05 : 0;
    return { ...d, score: Math.min(1, score + viewBonus) };
  });

  // Step 5: Per-member dislike penalty
  const memberPrefs = await getMemberPreferences(userId, options.familyMembers.map(m => m.id));
  candidates = candidates.map(d => {
    const memberPenalty = memberPrefs
      .filter(mp => mp.dish_id === d.id && mp.score < -0.5)
      .reduce((acc) => acc - 0.2, 0); // -0.2 per strongly-disliking member
    return { ...d, score: Math.max(-1, d.score + memberPenalty) };
  });

  // Step 6: Tủ Lạnh coverage scoring (if pantry_mode_enabled)
  if (options.pantryMode && options.pantryItems.length > 0) {
    candidates = candidates.map(dish => {
      const required = dish.ingredients_required.map(i => i.tag);
      const covered = required.filter(tag => options.pantryItems.includes(tag));
      const coverageRatio = covered.length / required.length;
      const missing = required.filter(tag => !options.pantryItems.includes(tag));

      let tier: 0 | 1 | 2;
      if (coverageRatio >= 0.8) tier = 0;       // nấu được ngay
      else if (missing.length === 1) tier = 1;   // mua thêm 1 thứ
      else tier = 2;                             // hidden

      return { ...dish, fridgeTier: tier, missingIngredients: missing.map(t => ingredientName(t)) };
    });
    candidates = candidates.filter(d => d.fridgeTier < 2);
  }

  // Step 7: Sort
  const healthWeight = { allow: 0, adapt: 1, caution: 2 };
  candidates.sort((a, b) => {
    if (options.pantryMode) {
      if (a.fridgeTier !== b.fridgeTier) return (a.fridgeTier ?? 2) - (b.fridgeTier ?? 2);
    }
    if (healthWeight[a.healthAction] !== healthWeight[b.healthAction])
      return healthWeight[a.healthAction] - healthWeight[b.healthAction];
    return b.score - a.score;
  });

  candidates = injectDiversity(candidates, topN=8);
  await redis.set(cacheKey, candidates, 'EX', 1800); // 30 min TTL
  return candidates.slice(0, 8);
}
```

### Slot Architecture

| Slot | dish_type | Mode | Cooldown |
|---|---|---|---|
| Món mặn 1 | `man` (thịt, cá, trứng, đậu hũ) | Swipe | 5 ngày |
| Món mặn 2 | `man` — exclude slot 1 selection | Swipe | 5 ngày |
| Canh / Súp | `canh` | Swipe | 3 ngày |
| Rau xào / luộc | `rau` | Swipe | 2 ngày |
| Tinh bột | `tinh_bot` | Auto = "cơm trắng" + Đổi button | N/A |

### Tủ Lạnh Tier Badges

| Tier | Condition | Badge | Sort |
|---|---|---|---|
| 0 | coverageRatio ≥ 80% | Green pill "✓ Nấu được ngay" | 1st |
| 1 | missing === 1 required ingredient | Amber pill "Mua thêm: [tên]" | 2nd |
| 2+ | missing ≥ 2 required | Hidden from deck | Filtered out |

> **Hard rule:** Health Rule Engine always runs at full strength in Fridge Mode. No dish that is health-blocked can appear in deck regardless of Tier 0 status.

### Empty Deck — Template-First (No LLM)

```typescript
// lib/deck/emptyDeckMessage.ts
// Single factor → template lookup. 2 factors → sort(reasons).join('+') → lookup.
// LLM fully removed from this path. 2-factor template matrix covers all cases.

const ALLOWED_DECK_ACTIONS = [
  'relax_budget', 'change_slot', 'manual_input', 'relax_cooldown', 'disable_fridge'
];
// Health rule relaxation is NEVER in ALLOWED_DECK_ACTIONS. Structural guarantee.
// Server validates all action values against this whitelist before returning to client.
```

---

## 08. Memory & Behavioral Engine

### Design Principle (Emotional Design System)

The Memory Engine's primary output is **reducing decision fatigue, not building gamification**. Every signal, every copy line, every touch point is optimized for:
1. **Relief** — the decision is done, cognitive load lifted
2. **Recognition** — "app biết gia đình tôi"
3. **Pride** — visible accumulation of care, shareable

### Preference Score Algorithm

```typescript
const SIGNAL_WEIGHTS = {
  swipe_right:           +0.30,
  swipe_left:            -0.15,
  meal_completed:        +0.10,
  recipe_view_first:     +0.05,  // first view only (view_count: 0→1)
  summary_swap:          -0.20,  // active removal from S-07 Summary (strong negative)
  member_strong_dislike: -0.20,  // per member with score < -0.5
  // reluctant_accept (-0.05) DEFERRED to Phase 2 — statistically noisy at low user counts
};
const DECAY_FACTOR = 0.95; // per week — stale preferences fade

function updateScore(current: number, event: SignalEvent): number {
  const delta = SIGNAL_WEIGHTS[event.type] ?? 0;
  return Math.max(-1, Math.min(1, current * DECAY_FACTOR + delta));
}

// Nightly popularity_score recompute:
// UPDATE dishes SET popularity_score = (
//   SELECT COALESCE(
//     COUNT(*) FILTER (WHERE direction = 'right')::decimal / NULLIF(COUNT(*), 0),
//     0.5  -- default for dishes with zero swipe data (prevents NULL → NaN)
//   )
//   FROM swipe_events WHERE dish_id = dishes.id
//     AND swiped_at > NOW() - INTERVAL '90 days'
// ) WHERE is_published = true;
```

### Cooldown Logic

```
mon_man:   5 days  — avoid repeating main dish
canh:      3 days
rau:       2 days
tinh_bot:  no cooldown (rice eaten daily is fine)

// Query: SELECT dish_id FROM meal_plans
//   WHERE user_id = ? AND meal_date >= NOW() - INTERVAL '[cooldown] days'
//   (flatten dishes jsonb array)
```

### Memory Engine Touch Points

| Touch Point | Trigger | UI | Frequency | Phase |
|---|---|---|---|---|
| **A — Micro-toast** | First time cooldown logic excludes a dish | Bottom toast 2s: "Đã bỏ qua Canh Chua Cá — tuần trước vừa ăn rồi 👋" | 1× lifetime only, never repeat | Phase 1 |
| **B — Family Memory Card** | After meal_plans count ≥ 7 | Card on S-05 between greeting and meal slots. "App đã học được · [3 facts]". Tap → editable profile. Dismiss → re-surface 7 days. | Every 7 days until user confirms/edits | Phase 1 |
| **C — Weekly Memory Summary** | Monday, user opens S-10 Lịch sử | Section "Tuần vừa qua" — 3 metrics: decisions made · health filtered · new dishes tried | Weekly | Phase 2 |

### Memory Card Facts — Template + Query (No LLM)

```typescript
// lib/memory/buildFacts.ts
async function buildMemoryFacts(userId: string, db: DB): Promise<MemoryFact[]> {
  const [dislikes, habits, avoided, health, newDishes] = await Promise.all([
    queryDislikeFacts(userId, db),     // swipe_left patterns → "Gia đình ít khi chọn [món/nhóm]"
    queryHabitFacts(userId, db),       // day-of-week patterns → "[Thứ N] thường chọn [loại]"
    queryAvoidedMethods(userId, db),   // cooking method aversion → "Chưa chọn món chiên lần nào"
    queryHealthFacts(userId, db),      // blocked/adapted count → "Đã lọc N món không phù hợp [tên]"
    queryNewDishFacts(userId, db),     // first-time accepts → "Đã thử N món mới trong X tuần"
  ]);
  return [...dislikes, ...habits, ...avoided, ...health, ...newDishes]
    .filter(f => f.confidence >= 0.6)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // show top 3 facts on Memory Card
}
```

| Fact Type | Confidence Threshold | Template |
|---|---|---|
| `dislike` | ≥ 3 left swipes same dish/ingredient | "Gia đình ít khi chọn [tên món] — mình sẽ giảm gợi ý" |
| `habit_day` | ≥ 3 same day-of-week pattern | "[Thứ N] gia đình thường chọn món [nhẹ/nhanh/...]" |
| `avoided_method` | 0 accepts of category in 4+ weeks | "Gia đình chưa chọn món [phương pháp] lần nào — mình sẽ giảm gợi ý" |
| `health_filter` | ≥ 5 dishes filtered | "Mình đã lọc [N] món không phù hợp [tên] ([bệnh lý])" |
| `new_dish` | ≥ 2 new dishes accepted | "Gia đình đã thử [N] món mới trong [X] tuần qua" |

---

## 09. Trial, Paywall & Payments

### Trial Logic (server-side enforced)

| Day Range | UI | Screen |
|---|---|---|
| Day 1–10 | Full access, no interruption | Normal S-05 |
| Day 11–14 | Amber ribbon: "Còn X ngày — Nâng cấp trước khi hết" | S-12a overlay |
| Day 12 (once) | Soft nudge modal, dismissible once. Anchor: "~4.600đ/ngày · rẻ hơn 1 ly trà đá" | S-12b modal |
| Day 15+ unpaid | Hard gate on all /app. S-10 + S-11 still readable (data not held hostage) | S-12c full screen |
| 30 days before renewal | S-12a ribbon returns | S-12a |

> Value anchor always shown **before** price: paywall shows `{meals_suggested}` và `{health_filtered}` counts from trial period before displaying pricing.

### Pricing

| Plan | Price | Per Day | Default CTA |
|---|---|---|---|
| 6 tháng | 990.000đ | ≈5.500đ | No (entry point) |
| **12 tháng** | **1.690.000đ** | **≈4.600đ** | **Yes** |
| Lifetime | 2.990.000đ | "Đầu tư cho gia đình" | No |

### PayOS Integration

```typescript
// POST /api/payment/create-order
{
  plan_type: "12m",       // default CTA
  amount: 1690000,
  description: "Hôm Nay Ăn Gì? — Gói 12 tháng",
  cancelUrl: "/app/upgrade?status=cancelled",
  returnUrl: "/api/payment/callback"
}

// PayOS webhook → POST /api/payment/webhook
// Step 1: HMAC-SHA256 signature verification FIRST — reject if invalid
const expectedSig = hmacSHA256(JSON.stringify(req.body.data), process.env.PAYOS_CHECKSUM_KEY);
if (req.body.signature !== expectedSig) return res.status(400).json({ error: 'invalid_signature' });

// Step 2: Idempotency check
const existing = await db.subscriptions.findFirst({
  where: { payos_order_id: orderId, status: 'completed' }
});
if (existing) return res.status(200).json({ received: true }); // no re-process

// Step 3: Update DB
// → INSERT subscriptions (plan_type, expires_at — NULL if lifetime)
// → UPDATE users SET subscription_status = 'active', subscription_expires_at = expires_at
// → send receipt email via Resend
// → unblock /app immediately

// NEVER store card numbers.
// Payment methods: MoMo · VNPAY QR · ATM nội địa · Visa/Mastercard
```

---

## 10. Chế Độ Tủ Lạnh — Fridge Mode

### Persistence — v3.0 Correction

> **Persistent, not session-only.** Northstar v1.1 and Wireframes v4.3 are authoritative. `pantry_items` are stored in DB per user. Toggle preference in `user_settings.pantry_mode_enabled` (also mirrored to localStorage for instant UI read).

| Data | Storage | TTL / Notes |
|---|---|---|
| `pantry_mode_enabled` toggle | DB (`user_settings`) + localStorage mirror | Permanent preference |
| `pantry_items[]` | DB (persistent per user profile) | Stale nudge >3d; auto-disable >5d |
| deck with fridgeTiers | Redis cache | 30 min, keyed by pantry_hash |

### 4 Screen States (v4.3)

| State | Screen ID | Description |
|---|---|---|
| Toggle row visible (OFF) | S-05+🧊 | Grey pill "Tủ lạnh hôm nay" · grey fridge icon on S-05 Home |
| Bottom sheet input | S-05🧊BS | 3 chip groups (Thịt/Cá · Rau/Củ/Đậu · Trứng/Khác) + free text field + "Áp dụng →" |
| Deck re-sorted (ON) | S-05🧊RS | Toggle green · Tier 0 = green border "✓ Nấu được ngay" · Tier 1 peeking = amber "Mua thêm: [tên]" |
| Summary with pantry | S-07🧊 | "✓ Đã có trong tủ" (strikethrough #bbb) + "🛒 Cần mua thêm" (amber bg, bold, qty) |

### User Flow

```
S-05 Home → tap toggle 🧊 "Tủ lạnh hôm nay"
→ Bottom sheet — 2 input modes (coexist):
   (A) Chip selection — ~18 chips: Thịt/Cá · Rau/Củ · Trứng/Khác. Tap to select.
   (B) Free text — "Nhập nguyên liệu..." → debounce 600ms → LLM parse → chips auto-highlight.
       Confidence ≥ 0.7: pre-selected (green). 0.4–0.7: amber border "Đúng không?". < 0.4: not pre-selected.
       User can toggle any chip regardless of LLM output.
→ Tap "Áp dụng →" → save to pantry_items (DB) → deck re-sort → close sheet
→ S-05 deck: Tier 0 first, Tier 1 second (health rules always applied)
→ Swipe as normal
→ S-07 Tủ Lạnh Variant: ingredient list with have/need-to-buy split
   └─ "Đã có trong tủ" → line-through #bbb
   └─ "Cần mua thêm" → amber bg #c97b2a, bold, qty
```

### NLP Ingredient Parsing Spec

```typescript
// POST /api/pantry/parse
// Body: { raw_text: "nửa con gà, cà chua, hành tây và vài quả trứng" }
// Returns: { tags: ["thit_ga","ca_chua","hanh_tay","trung_ga"],
//            display: [{ tag, name_vi, confidence: 0.0–1.0 }] }

// Security:
// 1. Truncate raw_text ≤ 200 chars before processing
// 2. Strip HTML/script tags before prompt injection
// 3. Output whitelist: only return tags present in ingredient_tags master list
//    Any tag LLM invents is silently discarded server-side
// 4. If sanitized input empty → return {tags:[], error:'empty_input'} — no LLM call
// Rate limit: 10 calls/user/session

// Gemini system prompt (locked):
// "Bạn nhận input tiếng Việt mô tả nguyên liệu trong tủ lạnh.
//  Trả về JSON: { ingredients: [{ tag (lowercase_no_accent_underscore), name_vi, qty_note }] }
//  Chỉ trả về nguyên liệu thực phẩm. Không hallucinate. Nếu không chắc → bỏ qua."

// Fallback on LLM fail: return {tags:[], error:'parse_failed'} → frontend falls back to chip-only mode
// Latency target: < 1.5s. Show spinner in text field while parsing.
// Cost: ~150 tokens/call, ~$1–2/month at scale.
```

### Shopping List — SQL Aggregation (No LLM)

```typescript
// lib/shoppingList.ts — called when building S-07🧊 variant
function buildShoppingList(confirmedDishes: DishCard[], pantryTags: string[]): ShoppingList {
  // Step 1: Flatten required ingredients across all confirmed dishes
  const allIngredients = confirmedDishes.flatMap(d =>
    d.ingredients_required.map(ing => ({ ...ing, dish_name: d.name_vi }))
  );

  // Step 2: Deduplicate by tag + sum qty (same unit)
  // e.g. thit_heo from 2 dishes: 150g + 100g = 250g
  const grouped = groupBy(allIngredients, 'tag');

  // Step 3: Partition — have vs need to buy
  const items = Object.values(grouped).map(ing => ({
    ...ing,
    have: pantryTags.includes(ing.tag),
  }));

  // Step 4: Unlock hint (pure set logic — no LLM)
  // "Mua thêm [X] → nấu được thêm Y món tuần này"
  // Precomputed from tier2Dishes (those filtered out of deck for missing 1 ingredient)
  const unlockHints = computeUnlockHints(pantryTags, tier2Dishes);
  // Show top 1 hint sorted by unlocks_dish_count DESC

  return {
    need_to_buy: items.filter(i => !i.have),
    already_have: items.filter(i => i.have),
    unlock_hint: unlockHints[0] ?? null,
    buy_count: items.filter(i => !i.have).length,
  };
}
```

### Stale Pantry Logic

```typescript
// Background job (nightly) + client-side check on app open:
async function checkPantryStale(userId: string): Promise<void> {
  const lastUpdate = await db.pantry_items.max('updated_at', { where: { user_id: userId } });
  if (!lastUpdate) return;

  const daysSince = daysBetween(lastUpdate, new Date());

  if (daysSince >= 5) {
    // Auto-disable pantry mode
    await db.user_settings.update({
      where: { user_id: userId },
      data: { pantry_mode_enabled: false }
    });
    // Next app open: toast "Tủ Lạnh đã tắt — nguyên liệu cũ hơn 5 ngày"
  } else if (daysSince >= 3) {
    // Show nudge banner on S-05:
    // "Tủ lạnh cập nhật lần cuối 3 ngày trước — cập nhật lại?"
    // Banner persists until user taps "Cập nhật" or dismisses
  }
}
```

---

## 11. Adaptive Cooking — LLM Gateway

### Architecture Principle

| Does | Does NOT |
|---|---|
| Personalize cooking instructions within dietitian-defined safety envelope | Decide whether a dish is safe |
| Leverage pantry context, family context, region, cooking skill | Modify safety_parameters |
| Write instructions that feel hand-crafted | Generate adaptations without dietitian_verified record |
| Suggest ingredient substitutions using available pantry items | Override a `block` decision |

### Prompt Architecture

| Component | Content | Owner | Version-Controlled |
|---|---|---|---|
| System prompt (locked) | Role + hard constraints from safety_parameters + output JSON spec + Vietnamese tone instructions | Dietitian + Engineering | Yes — requires dietitian sign-off on change |
| User prompt (per request) | Dish nutritional profile + member names + pantry items + cooking skill + region + llm_prompt_hint | Runtime-generated from DB + session | Per request, templated (not free-form) |

### Cache Strategy

| Cache | Key | TTL | Invalidation |
|---|---|---|---|
| Redis (primary) | `adapt:{dish_id}:{family_hash}` | 1 hour | Family profile update, pantry change |
| DB cache removed | — | — | Pantry persistent but family_hash still changes with pantry content; Redis 1h sufficient |

```typescript
// family_hash computation
function hashFamilyContext(adaptContexts: AdaptContext[], pantryItems: string[]): string {
  const conditions = adaptContexts
    .map(c => `${c.member_name}:${c.reason}`)
    .sort().join('|');
  const pantry = [...pantryItems].sort().join('|');
  return sha256(`${conditions}::${pantry}`).slice(0, 32); // 128-bit space, negligible collision
}
// Same family + same pantry = same hash = cache hit
// Any pantry change → new hash → fresh LLM call → better adapted instructions
```

### Model Selection

| Scenario | Model | Rationale |
|---|---|---|
| Single or multiple member conditions | Gemini 2.5 Flash | ~1s, cost-optimal, sufficient quality |
| Flash fails 2× | Serve `fallback_steps_vi` | No escalation to Pro. Log error to Sentry. |

### generateAdaptation — Full Flow

```typescript
async function generateAdaptation(
  dish: Dish, adaptContexts: AdaptContext[], familyContext: FamilyContext,
  pantryItems: string[], db: DB, redis: Redis
): Promise<MemberAdaptation[]> {

  // 1. Cache check
  const familyHash = hashFamilyContext(adaptContexts, pantryItems);
  const cacheKey = `adapt:${dish.id}:${familyHash}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // 2. Build + call Gemini
  try {
    const prompt = buildAdaptationPrompt(dish, adaptContexts, familyContext, pantryItems);
    const raw = await callGemini(prompt, { model: 'gemini-2.5-flash' });
    const output = parseAndValidate(raw, adaptContexts); // validates vs safety_parameters

    await redis.set(cacheKey, output, 'EX', 3600); // 1 hour
    return output;

  } catch (err) {
    // 3. Fallback — static dietitian-written instructions
    // User never sees error state. Internal flag source: 'fallback'.
    sentry.captureException(err);
    return adaptContexts.map(ctx => ({
      member_name: ctx.member_name,
      label_vi: 'Điều chỉnh khi nấu',
      steps_vi: ctx.fallback_steps_vi,
      source: 'fallback'  // internal only, not shown to user
    }));
  }
}
```

### LLM Cost Budget

| Use Case | Approach | Tokens/call | Cost/month @ 3k users |
|---|---|---|---|
| Adaptive cooking | LLM + Redis cache 1h | ~900 | ~$4–8 |
| Recipe tips | LLM cached 7 days per dish | ~500 | ~$40–50 |
| Tủ Lạnh NLP parsing | LLM, no cache (ephemeral input) | ~150 | ~$1–2 |
| Empty deck explanation | **Template only — LLM removed** | — | $0 |
| Shopping list | **SQL aggregation — no LLM** | — | $0 |
| Memory Card facts | **Template + query — no LLM** | — | $0 |
| Push notification copy | **Template — no LLM** | — | $0 |
| Paywall copy | **Fixed template + DB values — no LLM** | — | $0 |
| **TOTAL** | | | **< $60/month** |

> **Design principle:** LLM only when output genuinely requires flexible language + context-specific personalization that cannot be templated. Default to SQL + templates — cheaper, faster, deterministic, testable.

---

## 12. Food Photo Generation Pipeline

> **Offline batch only.** Never called at runtime. Pipeline runs **once per dish**. After upload to R2 and `dishes.image_status = 'ready'`, the image is canonical and never regenerated. App only reads `image_url` from DB.

### 4-Layer Architecture

| Layer | Content | Contribution |
|---|---|---|
| 1 — System Prompt (locked) | Style, framing, lighting, lens, Vietnamese food styling philosophy | 50% |
| 2 — Reference Images (5 per dish) | Real food photos: ingredient accuracy (broth color, meat texture). AI pre-filter, human final pick | 30% |
| 3 — User Prompt (per dish) | Dish name + composition note + garnish lock. 1–3 sentences max | 15% |
| 4 — CSS Post-process | `filter: brightness(0.97) saturate(1.08) blur(0.3px)` — applied client-side, not baked | 5% |

### Dish Categories & Image Specs

| Category | Key Style | Output Size |
|---|---|---|
| A — Canh / Súp | Steam wisps, clay pot, natural broth color | 800×600px landscape |
| B — Kho / Braised | Caramel glaze, dark clay pot, glistening sauce | 800×600px |
| C — Xào / Stir-fry | Wok hei implied, vibrant veg, oil sheen | 800×600px |
| D — Hấp / Steamed | Steam visible, bamboo steamer, delicate | 800×600px |
| E — Cơm / Rice | White ceramic bowl, overhead or 45° angle | 800×800px square |
| F — Gỏi / Salads | Fresh herbs prominent, light background | 800×600px |

### Pipeline SOP

```
1. Reference collection (per dish)
   → Auto-search Google Images + GrabFood/ShopeeFood thumbnails
   → AI pre-filter: remove < 400px, watermarks, wrong dish
   → Human final pick: "thấy rõ nguyên liệu?"
   → Keep 5 best references

2. Generation (Nano Banana API — admin script only)
   → System prompt (locked) + 5 refs + user prompt
   → Generate 3 variants per dish
   → Human QC: pick best 1

3. Post-process & upload
   → Resize/optimize (WebP, quality 85)
   → Upload to R2: /dishes/{dish_id}/hero.webp
   → UPDATE dishes SET
       image_url = 'https://r2.hnag.vn/dishes/{dish_id}/hero.webp',
       image_status = 'ready',
       image_generated_at = NOW()
     WHERE id = {dish_id}
   → Guard: pipeline script checks image_status BEFORE running.
     If image_status = 'ready' → SKIP, no API call.

4. CSS filter applied client-side (no re-upload)
```

> **No-Regeneration Rule:** If `image_status = 'ready'` → pipeline SKIPS. Human QC-approved images are never auto-regenerated. To replace: use `PATCH /api/admin/dish/:id/reset-image` (admin only).

### Admin Image Endpoints

| Endpoint | Action |
|---|---|
| `PATCH /api/admin/dish/:id/reset-image` | Set `image_status = 'pending'`, clear `image_url` + `image_generated_at`. Requires admin auth + `{confirm: true}` body. |
| `GET /api/admin/dishes/image-status` | Count per status (pending/generating/ready/failed). Health check before/after batch run. |

---

## 13. SEO Blog — W-07 Dinh Dưỡng

### Route Architecture

```
/dinh-duong                → W-07 Hub page (category filter pills: Tất cả · Gout · Tiểu đường · Huyết áp · Trẻ em · Nấu nhanh · Mùa & Nguyên liệu · Dạ dày · Mỡ Máu)
/dinh-duong/[slug]          → W-07b Article Detail
```

### 4 Screen Variants (v4.3)

| Screen ID | Description |
|---|---|
| W-07 Desktop | Editorial/magazine layout, dark header #1E1410, category filter pills, featured article card, article grid, app cross-sell block, newsletter signup |
| W-07 Mobile | Same URL, responsive — horizontal scroll tabs, single-col grid, sticky bottom CTA bar |
| W-07 Logged-in | Avatar replaces "Dùng thử", personalized callout "Gợi ý theo gia đình bạn — [bệnh_lý]", first tab = "Cho gia đình tôi", app bottom nav visible (Dinh Dưỡng active) |
| W-07b Article Detail | Back bar ← + share ↗, article body, inline contextual CTA, bottom nav Dinh Dưỡng active |

### Content Architecture

| Cluster | Hub Keywords | Articles | In-article CTA |
|---|---|---|---|
| Gout | "gout ăn gì", "bệnh gout kiêng ăn gì" | 8–12 | "App tự động lọc món an toàn cho người gout" |
| Tiểu đường | "tiểu đường nên ăn gì", "thực đơn tiểu đường" | 8–12 | Same pattern |
| Huyết áp | "huyết áp cao kiêng ăn gì" | 6–8 | Same pattern |
| Dạ dày | "đau dạ dày ăn gì" | 6–8 | Same pattern |
| Mỡ máu cao (v3.1) | "mỡ máu cao ăn gì", "thực đơn giảm mỡ máu", "giảm cholesterol" | 6–8 | Same pattern |
| Gan nhiễm mỡ (v3.1) | "gan nhiễm mỡ nên ăn gì", "gan nhiễm mỡ kiêng gì" | 6–8 | Same pattern |
| Giảm cân / Béo phì (v3.1) | "thực đơn giảm cân", "ăn gì để giảm cân", "bữa ăn ít calo" | 6–8 | Same pattern |
| General family | "thực đơn gia đình tuần", "chiều nay nấu gì" | 10–15 | "Hỏi AI ngay" |
| **Total** | | **~73–99 articles** | |

> **suy_than:** Không có cluster SEO riêng — search intent thiên về clinical/medical (nephrologist queries), không phải meal planning. Defer SEO cluster to Phase 3 if traffic data justifies.

Cadence: 2 articles/week. Clusters × 10+ articles = topical authority per condition.

### Technical SEO

```typescript
// Rendering: SSG (Astro getStaticPaths) — pre-renders at build time
// File: src/pages/dinh-duong/[slug].astro

// "ISR" on Cloudflare Pages = manual cache-control:
// response.headers.set('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
// On-demand purge after CMS publish: call Cloudflare Cache API
// DO NOT rely on Vercel-style ISR revalidation — not available on CF Pages natively.

// Structured data per article:
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1]",
  "author": { "@type": "Organization", "name": "Hôm Nay Ăn Gì?" },
  "medicalAudience": "Patient",
  "about": { "@type": "MedicalCondition", "name": "[condition_vi]" },
  "dateModified": "[last_reviewed_at]",  // E-E-A-T signal
  "reviewedBy": { "@type": "Person", "name": "[reviewed_by]" }
}

// Hub pages: FAQPage schema (4 long-tail questions per cluster)
// All pages: BreadcrumbList schema — Home → Dinh Dưỡng → [Category] → [Article]
// Article detail: MedicalWebPage schema where applicable

// Internal linking:
// - Every article: 2–3 links back to /app (UTM tracked)
// - Every article: 3–5 links to other articles in same cluster
// - Hub page: links to all spokes in cluster

// canonical URL, hreflang vi-VN, og:image 1200×630
```

### Logged-in Personalization

- **Unauthenticated:** Full article readable. "Dùng thử" in nav. Sticky bottom CTA. Optimized for SEO crawl.
- **Logged-in:** Personalized badge from Family Profile: "✓ An toàn cho gia đình bạn" or "⚠ Xem lưu ý cho [tên thành viên]". Bottom nav app visible (Dinh Dưỡng tab active). `client:visible` hydration — badge lazy-loads on viewport, article content stays static HTML.

---

## 14. PWA Spec & Offline

### Web App Manifest

```json
{
  "name": "Hôm Nay Ăn Gì?",
  "short_name": "HNAG",
  "icons": [{ "src": "/icons/icon-192.webp", "sizes": "192x192" },
            { "src": "/icons/icon-512.webp", "sizes": "512x512" }],
  "display": "standalone",
  "start_url": "/app",
  "theme_color": "#D9622B",
  "background_color": "#FAF8F5"
}
```

### Service Worker Cache Strategy (Workbox)

```typescript
// @vite-pwa/astro integration
const runtimeCaching = [
  {
    urlPattern: /\/api\/deck/,
    handler: 'NetworkFirst',
    options: { cacheName: 'deck-cache', expiration: { maxAgeSeconds: 1800 } }
  },
  {
    urlPattern: /\/api\/recipe/,
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'recipe-cache', expiration: { maxEntries: 100 } }
  },
  {
    urlPattern: /r2\.hnag\.vn\/dishes/,
    handler: 'CacheFirst',
    // Food images: immutable after pipeline. 30-day cache.
    options: { cacheName: 'images', expiration: { maxEntries: 200, maxAgeSeconds: 2592000 } }
  }
];
```

### Offline Fallback Behavior

| Data Type | Offline Behavior |
|---|---|
| Family profile | Cached (Service Worker), instant load |
| Meal history (30 days) | Cached, readable offline |
| 50 most recent dishes | Cached (stale while revalidate) |
| Deck generation | Network-first; offline = fallback page "Cần kết nối để gợi ý món" |
| Push notifications | Deep link: tap → `/app/home?meal=dinner` → auto-select meal tab |

### Breakpoints

| Viewport | Range |
|---|---|
| Mobile | ≤ 480px |
| Tablet | 481–768px |
| Desktop | ≥ 769px |
| Max-width | 1200px |

---

## 15. Onboarding Screens (S-01 → S-04b)

### S-01 Splash

Static screen. Logo + tagline + social proof. Primary CTA → Google auth. Secondary → Facebook or Phone OTP.

### S-01b Demo Swipe (Aha Moment)

Between S-01 and S-02. Goal: user experiences swipe mechanic before committing to onboarding.

```typescript
// Data source: static JSON bundled in client (4 popular dishes: Canh chua cá, Thịt kho tàu,
//   Rau muống xào, Cơm trắng). No API call. No auth required.
// Events: swipe_events NOT written — user has no user_id yet.
// Swipe gesture: full animated Tinder swipe — shared SwipeCard component.
// After 4 swipes or "Xem thêm" tap → navigate('/onboarding/family') [S-02]
// Back button: yes — can return to S-01 Splash.
```

### S-02 Family Members

Ask **only**: (1) Số thành viên, (2) Tên + tuổi per member. No health questions here — those are in S-03.

### S-03 Health Conditions

```typescript
// Health chip selection — v3.1 (9 options):
const ONBOARDING_HEALTH_CHIPS = [
  { id: 'gout',         label: 'Gout' },
  { id: 'mo_mau_cao',   label: 'Mỡ máu cao' },
  { id: 'da_day',       label: 'Dạ dày' },
  { id: 'tieu_duong',   label: 'Tiểu đường' },
  { id: 'huyet_ap',     label: 'Huyết áp' },
  { id: 'gan_nhiem_mo', label: 'Gan nhiễm mỡ' },
  { id: 'suy_than',     label: 'Suy thận' },
  { id: 'beo_phi',      label: 'Muốn giảm cân' },
  { id: 'none',         label: 'Không có' },
];
// v3.1: +gan_nhiem_mo, +suy_than, +beo_phi (renamed from 'Mỡ máu' → 'Mỡ máu cao' for clarity)
// 'beo_phi' label = 'Muốn giảm cân' — avoids clinical framing of obesity in self-report context.
// 'none' always last. Multi-select. Selecting 'none' deselects others.
// Free-text allergy input separate from chips.
// health_consent checkbox mandatory before proceeding (Nghị định 13/2023).
// Preferences (ingredient likes/dislikes) NOT asked here — learned via swipe behavior.
```

### S-04 Cooking Habits (W-04 defaults corrected)

```typescript
// Corrected defaults (v3.0 — from W-04 wireframe):
const COOKING_HABITS_DEFAULTS = {
  cook_time_weekday_min:  30,    // was incorrectly documented as 45 in v2.2
  cook_time_weekend_min:  60,
  budget_weekday_vnd:     120000, // 120.000đ
  budget_weekend_vnd:     200000, // 200.000đ
  meal_slots: ['lunch', 'dinner'],
};
```

### S-04b Cam Kết App (New v4.1)

Between S-04 and S-05. **No Back button** — one-way gate. Sets realistic accuracy expectations and commitment device.

```typescript
// Content:
// Day 1 card: "Gợi ý dựa trên thông tin vừa nhập. Chính xác khoảng 70% — hoàn toàn bình thường."
// Day 7 card: "App nhớ thói quen, món đã chọn, món bị bỏ qua. Gợi ý đạt ~85%."
// Day 30 card (highlighted): "App hiểu gia đình bạn hơn bất kỳ công cụ nào."
// Trust badge: Viện Dinh Dưỡng Quốc Gia
// CTA: "Bắt đầu 14 ngày dùng thử →" + "Không cần thẻ tín dụng"

// On CTA tap:
await db.users.update({
  where: { id: userId },
  data: {
    onboarding_completed: true,
    trial_started_at: new Date(), // trial clock starts HERE
  }
});
navigate('/app', { replace: true }); // replace not push — Back cannot return to onboarding
```

---

## 16. API Endpoint Reference

### Standard HTTP Response Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (e.g. accessing other user's data) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, idempotency collision) |
| 422 | Unprocessable entity (semantic validation failed) |
| 429 | Rate limited |
| 500 | Internal server error — log to Sentry |

**Auth header:** All authenticated endpoints require `Authorization: Bearer <jwt>` or Supabase session cookie. Server reads `auth.uid()` from JWT — never trust client-sent user_id.

---

### POST `/api/deck`

**Auth:** Required  
**Purpose:** Generate swipe deck for a meal slot. Server resolves health constraints, preferences, pantry — client never sends these.

**Request body:**
```typescript
{
  meal_type:    "breakfast" | "lunch" | "dinner";
  slot_type:    string;         // e.g. "mon_man_1", "canh", "rau"
  session_id:   string;         // uuid — groups swipes per meal session
  pantry_mode?: boolean;        // default false; if true, applies Tủ Lạnh tier scoring
}
```

**Response 200:**
```typescript
{
  dishes: Array<{
    id:             string;         // uuid
    slug:           string;
    name_vi:        string;
    image_url:      string;         // R2 CDN URL, always image_status='ready'
    cook_time_min:  number;
    budget_tier:    "low" | "mid" | "high";
    health_result: {
      action:             "allow" | "adapt" | "caution";   // 'block' never in deck
      tooltip_vi?:        string;   // caution only: "Dùng lượng nhỏ"
      tooltip_detail_vi?: string;   // caution only: short reason on tap
      adapt_contexts?: Array<{
        member_name:       string;
        reason:            string;
        fallback_steps_vi: string[];
      }>;
    };
    pantry_tier?:  0 | 1;           // present only when pantry_mode=true
    missing_ingredient?: string;    // present only when pantry_tier=1
    health_tags: Array<{            // shown on first card (onboarding trust signal)
      member_name: string;
      label_vi:    string;          // e.g. "Gout OK", "Gout · điều chỉnh"
      type:        "ok" | "adapt";
    }>;
  }>;
  session_id: string;
  deck_size:  number;
}
```

**Error cases:**
- `401` — not authenticated
- `422` — invalid meal_type or slot_type value
- `429` — rate limited (max 60 deck requests/user/hour)

---

### POST `/api/swipe`

**Auth:** Required  
**Purpose:** Record swipe event. Memory Engine update is async — does not block response.

**Request body:**
```typescript
{
  dish_id:      string;                       // uuid
  direction:    "right" | "left" | "defer";
  meal_type:    "breakfast" | "lunch" | "dinner";
  slot_type:    string;
  session_id:   string;                       // uuid — must match deck session
  deck_position: number;                      // 1-indexed card rank when swiped
}
```

**Response 200:**
```typescript
{ recorded: true }
```

**Error cases:**
- `401` — not authenticated
- `400` — missing required field
- `422` — dish_id not found or not published

---

### POST `/api/meal-plan`

**Auth:** Required  
**Purpose:** Confirm all slots for a meal. Increments `total_meals_completed`. Triggers care_days increment if first meal of calendar day.

**Request body:**
```typescript
{
  meal_date:  string;   // ISO date "YYYY-MM-DD"
  meal_type:  "breakfast" | "lunch" | "dinner";
  dishes: Array<{
    dish_id:   string;  // uuid
    slot_type: string;
    is_auto:   boolean; // true for tinh_bot (cơm) auto-filled
  }>;
}
```

**Response 201:**
```typescript
{
  meal_plan_id:       string;   // uuid
  care_days_count:    number;   // updated counter
  recognition_copy?:  string;   // present after ≥10 meals — S-07 emotional copy
  copy_key?:          string;   // key written to last_recognition_copy_key
}
```

**Error cases:**
- `401` — not authenticated
- `400` — meal_date invalid format
- `409` — meal_plan already exists for this user/date/type (use PUT to update)

---

### POST `/api/pantry/parse`

**Auth:** Required  
**Purpose:** NLP parsing of free-text ingredient input. Calls Gemini 2.5 Flash. Rate limited.

**Request body:**
```typescript
{
  raw_text: string;   // max 200 chars, e.g. "nửa con gà, cà chua, mấy quả trứng"
}
```

**Response 200:**
```typescript
{
  parsed: Array<{
    tag:        string;   // normalized: "thit_ga", "ca_chua", "trung_ga"
    name_vi:    string;   // display: "Thịt gà", "Cà chua", "Trứng gà"
    confidence: number;   // 0.0–1.0
    confirmed:  boolean;  // true if confidence >= 0.7 (auto-select chip)
                          // false if 0.4–0.69 (amber chip, user must tap to confirm)
  }>;
  raw_text_echo: string;
}
```

**Error cases:**
- `401` — not authenticated
- `400` — raw_text exceeds 200 chars or empty
- `422` — LLM returned unparseable response (graceful: return `{ parsed: [], raw_text_echo }`)
- `429` — rate limit: 10 requests/user/session

---

### POST `/api/payment/create-order`

**Auth:** Required  
**Purpose:** Create PayOS checkout order. Returns redirect URL.

**Request body:**
```typescript
{
  plan_type: "6m" | "12m" | "lifetime";
}
```

**Response 200:**
```typescript
{
  checkout_url: string;    // PayOS hosted checkout page — redirect user here
  order_id:     string;    // payos_order_id — store client-side for callback verification
  amount_vnd:   number;    // 990000 | 1690000 | 2990000
  expires_at:   string;    // ISO datetime — order expires after 15 min
}
```

**Error cases:**
- `401` — not authenticated
- `409` — user already has active subscription
- `422` — invalid plan_type
- `500` — PayOS API unreachable (retry with exponential backoff)

---

### POST `/api/payment/webhook`

**Auth:** None (PayOS calls this directly)  
**Security:** HMAC-SHA256 signature verification MUST be step 1 before any DB operation.

**Request body (PayOS format):**
```typescript
{
  code:      string;
  desc:      string;
  data: {
    orderCode:       number;
    amount:          number;
    description:     string;
    accountNumber:   string;
    reference:       string;
    transactionDateTime: string;
    currency:        string;
    paymentLinkId:   string;
    code:            string;
    desc:            string;
  };
  signature: string;   // HMAC-SHA256(JSON.stringify(data), PAYOS_CHECKSUM_KEY)
}
```

**Response 200:**
```typescript
{ received: true }
```

**Processing steps (in order — do not skip):**
1. Verify `signature` — return `400` immediately if invalid
2. Idempotency check: `SELECT FROM subscriptions WHERE payos_order_id = ? AND status = 'completed'` — return `200` if exists (no re-process)
3. Insert `subscriptions` row (plan_type, expires_at — NULL if lifetime)
4. Update `users.subscription_status` + `subscription_expires_at`
5. Send receipt email via Resend
6. Return `200`

**Error cases:**
- `400` — signature verification failed
- `500` — DB write failed (PayOS will retry — idempotency check handles re-delivery)

---

### Remaining Endpoints — Summary Table

The following endpoints have simpler contracts. Cursor should infer exact field names from the database schema above.

| Method | Path | Auth | Request | Response | Errors |
|---|---|---|---|---|---|
| `GET` | `/api/meal-plan/today` | Required | — | `MealPlan[]` for today | 401 |
| `PUT` | `/api/meal-plan/:id/status` | Required | `{status: "completed"\|"skipped"}` | `{updated: true}` | 401, 404, 422 |
| `GET` | `/api/recipe/:slug` | Required | — | Full recipe + LLM tips (cached 7d) | 401, 404 |
| `POST` | `/api/recipe/:slug/member-rejection` | Required | `{member_id: uuid}` | `{recorded: true}` | 401, 403, 404 |
| `GET` | `/api/family` | Required | — | `FamilyMember[]` (deleted_at IS NULL) | 401 |
| `POST` | `/api/family/members` | Required | `{name, age, role, health_conditions[], allergies[]}` | `FamilyMember` | 401, 422 |
| `PUT` | `/api/family/members/:id` | Required | Partial `FamilyMember` fields | `FamilyMember` | 401, 403, 404 |
| `DELETE` | `/api/family/members/:id` | Required | — | `{deleted: true}` | 401, 403, 404 |
| `GET` | `/api/settings` | Required | — | `UserSettings` | 401 |
| `PUT` | `/api/settings` | Required | Partial `UserSettings` fields | `UserSettings` | 401, 422 |
| `GET` | `/api/pantry/ingredients` | Required | — | `IngredientChip[]` (CDN-cached) | 401 |
| `GET` | `/api/pantry/items` | Required | — | `PantryItem[]` | 401 |
| `POST` | `/api/pantry/items` | Required | `{items: [{tag, name_vi, quantity_note?}]}` | `{upserted: number}` | 401, 422 |
| `DELETE` | `/api/pantry/items` | Required | — | `{cleared: true}` | 401 |
| `GET` | `/api/payment/callback` | None | PayOS query params | Redirect → `/app` or `/app/upgrade?status=failed` | — |
| `GET` | `/api/memory/summary` | Required | — | Memory Card facts object | 401 |
| `GET` | `/api/rewards/care-days` | Required | — | `{care_days_count, total_meals, memory_phase, memory_copy}` | 401 |
| `GET` | `/api/rewards/recognition-copy` | Required | — | `{copy: string, copy_key: string}` | 401 |
| `GET` | `/api/blog/articles` | None | `?category=gout` optional | `BlogArticle[]` (published) | — |
| `GET` | `/api/blog/articles/:slug` | None | — | Full `BlogArticle` | 404 |
| `GET` | `/api/user/profile` | Required | — | `User` + subscription status | 401 |
| `PUT` | `/api/user/profile` | Required | `{display_name?, email?, phone?}` — partial update, only changed fields | `User` (updated) | 401, 409 (email taken), 422 |
| `POST` | `/api/user/avatar` | Required | `multipart/form-data {file: Blob}` — jpg/png/webp/heic · max 5MB | `{avatar_url: string}` — R2 CDN URL | 401, 413 (file too large), 415 (unsupported format) |
| `DELETE` | `/api/user/account` | Required | `{confirm: true}` | `{scheduled: true}` | 401, 400 |
| `PATCH` | `/api/admin/dish/:id/reset-image` | Admin | `{confirm: true}` | `{reset: true}` | 401, 403 |
| `GET` | `/api/admin/dishes/image-status` | Admin | — | `{pending, generating, ready, failed: number}` | 401, 403 |

---

## 17. Background Jobs

All jobs run as Supabase scheduled functions or Cloudflare Workers cron triggers.

| Job | Schedule | Logic |
|---|---|---|
| **Popularity score recompute** | Daily 02:00 HCM | UPDATE dishes.popularity_score from swipe_events (90d window). COALESCE default 0.5 for zero-data dishes. |
| **care_days_count update** | Daily 00:05 HCM | For each user: SELECT COUNT(DISTINCT meal_date) FROM meal_plans WHERE status='completed'. SET users.care_days_count = result. Never decrements. |
| **Pantry stale check** | Daily 08:00 HCM | For each user with pantry_items: check MAX(updated_at). ≥3d → set stale flag for nudge. ≥5d → SET user_settings.pantry_mode_enabled = false. |
| **Trial expiry check** | Hourly | For users where trial_started_at + 14 days ≤ NOW() AND subscription_status = 'trial': SET subscription_status = 'expired'. |
| **Weekly Card generation** | Sunday 20:00 HCM | For users with ≥3 meals in past 7 days: generate Weekly Card data_snapshot + PNG (Cloudflare Worker + Canvas). INSERT family_reports. (Phase 2) |
| **Monthly Report generation** | Last day of month 20:00 | For users with ≥10 meals in month: generate Monthly Report + PNG. INSERT family_reports. (Phase 2) |
| **Inactive account cleanup** | Monthly 1st 03:00 | Email warning to users inactive >23 months. Hard delete users inactive >24 months (GDPR/NĐ13 retention policy). |
| **RTBF processing** | Daily 03:00 | Hard delete users where account_deletion_requested_at < NOW() - 30 days. Delete: users, family_members, swipe_events, meal_plans, user_preferences, pantry_items, user_settings. |

---

## 18. Dopamine & Rewards System (Emotional UX)

> **Design Principle (Emotional Design System):**
> - Recognition = talk about the family, not the app
> - Reward = accumulated evidence that can be shared — not points or badges
> - Dopamine = from resolution (decision made, cognitive load lifted) — not engagement
> - **NOT building:** streak counter · guilt-trip push notifications · gamification badges · in-session rating after choosing meal · animations > 300ms

### Micro-Rewards During Session

| Trigger | Feedback | Implementation |
|---|---|---|
| Swipe accept | Card snap to slot + haptic pulse | `navigator.vibrate(12)`. CSS: `transform 180ms cubic-bezier(0.34,1.56,0.64,1)`. **Hard limit: ≤ 300ms total. Test on Snapdragon 450.** |
| All slots confirmed | S-07 slide-up: **X người · ~Y phút · ~Zk** | Y = SUM(cook_time + prep_time) rounded to nearest 5 min. Z = SUM(budget_tier midpoint). Slide-up: `translateY(100%) → 0, ease-out 220ms`. |
| Tủ Lạnh Tier 0 card | Green pill "✓ Nấu được ngay" top-right card corner | `background: #dcfce7; color: #15803d; font-size: 9px; border-radius: 100px`. Tier 1 = no pill (delta indicator sufficient). |
| S-07 ingredient list | Đã có = strikethrough grey · Cần mua = amber bold | `have: line-through; color: #bbb`. `need: color: #c97b2a; font-weight: 600`. |

### Memory Copy Phases

```typescript
function getMemoryCopy(mealCount: number): { phase: number; copy: string } {
  if (mealCount < 10) return {
    phase: 1,
    copy: 'Đang tìm hiểu gia đình bạn'  // no count — avoids "only 3 meals" disappointment
  };
  if (mealCount < 30) return {
    phase: 2,
    copy: `Dựa trên ${mealCount} bữa của gia đình bạn`
  };
  return { // Phase 3 — ships with Phase 2
    phase: 3,
    copy: `Bộ nhớ gia đình: ${mealCount} bữa · Gợi ý đã cá nhân hoá`
  };
}
// Display: subtitle under greeting on S-05 Home
// Threshold: show only after meal #10. Meals 1–9: no copy phase shown.
```

### "Ngày Chăm Sóc" Counter

```typescript
// Counter = number of calendar days with at least 1 completed meal plan
// Add-only — never decrements, never resets. Missing days do not reduce count.
// "Ngày Chăm Sóc" is an identity accumulator, not a performance metric.

// Nightly background job (see Section 17):
// SELECT COUNT(DISTINCT meal_date) FROM meal_plans
//   WHERE user_id = ? AND status = 'completed'
// → SET users.care_days_count = result

// Display on S-07 Summary (below stats line), only when care_days_count ≥ 1:
// "{care_days_count} ngày gia đình được chăm sóc"
```

### Recognition Copy Library (S-07 — 12+ Variants)

Priority: **Milestone → Bệnh lý context → Tủ Lạnh context → Generic rotation**

| Group | Trigger | Copy |
|---|---|---|
| Milestone — day 1 | `care_days_count === 1` | "Ngày đầu tiên gia đình được chăm sóc 🌱" |
| Milestone — day 7 | `care_days_count === 7` | "7 ngày rồi — gia đình đang được chăm sóc đều đặn" |
| Milestone — day 30 | `care_days_count === 30` | "30 ngày. Một tháng gia đình ăn có chủ đích." |
| Milestone — day 100 | `care_days_count === 100` | "100 ngày chăm sóc gia đình — không phải ai cũng làm được điều này." |
| Bệnh lý — gout | member has gout + meal has no blocked dish | "Bữa hôm nay phù hợp Ba — không có món nào cần tránh" |
| Bệnh lý — tiểu đường | member has diabetes + all dishes allowed/adapted | "Cả bữa giữ được chỉ số đường cho Mẹ" |
| Bệnh lý — huyết áp | member has hypertension + adapted dishes present | "Món kho đã điều chỉnh muối cho Ba — nhỏ thôi nhưng đáng" |
| Tủ Lạnh — all Tier 0 | all dishes in meal = fridgeTier 0 | "Nấu hết từ nguyên liệu trong nhà — không cần đi chợ" |
| Tủ Lạnh — mixed | ≥1 dish fridgeTier 0 | "Tận dụng được [X] thứ trong tủ cho bữa hôm nay" |
| Generic A | fallback rotation | "Quyết định xong rồi — gia đình được chăm sóc hôm nay" |
| Generic B | fallback rotation | "Bữa [sáng/trưa/tối] đã plan — nhẹ hơn một gánh lo" |
| Generic C | fallback rotation | "[care_days_count] ngày gia đình được chăm sóc — hôm nay thêm một ngày" |

```typescript
function getRecognitionCopy(context: RecognitionContext): string {
  const milestones = [1, 7, 30, 100, 200, 365];
  if (milestones.includes(context.careDays)) return MILESTONE_COPY[context.careDays];
  if (context.familyConditions.includes('gout'))        return CONDITION_COPY.gout;
  if (context.familyConditions.includes('diabetes'))    return CONDITION_COPY.diabetes;
  if (context.familyConditions.includes('hypertension')) return CONDITION_COPY.hypertension;
  if (context.hasFridgeTier0)    return FRIDGE_COPY.tier0_all;
  if (context.fridgeItemsUsed > 0) return FRIDGE_COPY.mixed(context.fridgeItemsUsed);
  return nextGenericCopy(context.lastCopyShown, context.careDays, context.mealType);
  // Rotation: never repeat same copy_key twice in a row
}
// Writes last_recognition_copy_key to users table after selection
```

### Phase 2 Additions (After Day-30 Cohort ≥ 200 Users)

**Weekly Card (auto-generated Sunday 20:00):**
- Trigger: ≥ 3 meals in past week
- Content: meals count · distinct dishes · "0 vi phạm bệnh lý" or "X món điều chỉnh cho [tên]" · care_days accumulation
- Design: editorial lifestyle card (Fraunces font, warm cream/soft green). NOT gamified. NO logo dominance.
- Caption: auto-template (no LLM). User can edit before sharing.
- Share: Facebook + Zalo (Web Share API + fallback copy). PNG rendered server-side (Cloudflare Worker + Canvas API).

**Monthly Report Card (last day of month):**
- Minimum: ≥ 10 meals in month
- Data: care days · total meals · distinct dishes · health violations (0 = best result) · fridge uses · top dish
- Output: shareable PNG + saved to Sổ Gia Đình

**Sổ Gia Đình (archive, S-11 → Settings):**
- Access via S-11 Settings — no bottom nav tab (saves navigation real estate)
- Content: all Monthly Report Cards archived by month
- Schema: `family_reports` table (see Section 04)

### What NOT to Build (Phase 1 Hard Constraints)

| Feature | Reason |
|---|---|
| Streak counter | Creates anxiety on miss. Real family life is unpredictable — streak punishes reality. |
| Push notification "Chưa plan bữa tối!" | Guilt-trip at busiest moment of day. Inverse retention effect. |
| Badges / gamification points | Noise disconnected from caregiver identity. |
| In-session meal rating | Turns resolution moment into new task. Kills dopamine loop. |
| Animation > 300ms on swipe | Friction for rushed users. Test on Snapdragon 450. |

---

## 19. Data Privacy & Compliance (Nghị Định 13/2023/NĐ-CP)

> App collects **sensitive personal health data** (gout, diabetes, hypertension, food allergies) — classified as **nhạy cảm** per Article 2(4), Nghị định 13/2023. Violation penalties: up to 5% annual revenue or suspension.

### Compliance Checklist

| Obligation | Implementation | Phase |
|---|---|---|
| **Explicit consent** before health data collection | S-03: standalone health consent checkbox (not bundled with ToS). Text: "Tôi đồng ý cho Hôm Nay Ăn Gì? xử lý thông tin sức khoẻ để gợi ý món ăn phù hợp." Store: `health_consent_given_at` + `health_consent_version`. Block health data write if NULL. | Phase 1 |
| **Purpose limitation** | Health data (conditions, allergies) used only for Rule Engine. Not aggregated, not used for ads, not sold. Document in Privacy Policy. | Phase 1 |
| **Privacy Policy + ToS** | Legal document required before launch. Vietnamese + English. Covers: data controller, data collected, purpose, retention, user rights, contact. | Phase 1 |
| **Right to access** | `GET /api/user/data-export` — full JSON export. In S-11 Settings → "Dữ liệu của tôi". | Phase 2 |
| **Right to erasure (RTBF)** | `DELETE /api/user/account` — hard delete (not soft). Background job within 30 days. Tables: users, family_members, swipe_events, meal_plans, user_preferences, pantry_items, user_settings. | Phase 2 |
| **Data retention** | Swipe events: max 2 years. Health conditions: deleted when member deleted. Inactive accounts (>24 months): auto-purge with 30-day email warning. | Phase 2 |
| **Cross-border transfer** | Supabase: ap-southeast-1 (Singapore). CF R2: nearest edge. Upstash: ap-southeast-1. Gemini API: Google processes data — document in Privacy Policy. **Risk: confirm Singapore jurisdiction is sufficient under NĐ13 — legal counsel required.** | Phase 1 (review) |

---

## 20. Performance Targets & Infra

### Core Web Vitals Targets

| Metric | Target | Measured On |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | W-01 Landing (SSG) |
| FID / INP | < 100ms | /app swipe interaction |
| CLS | < 0.1 | All pages |
| Swipe animation | ≤ 300ms total | S-05 deck, tested on Snapdragon 450 |
| Deck API response | < 800ms p95 | POST /api/deck |
| LLM adaptation latency | < 1.5s (pre-generated during deck build) | S-06 badge tap → bottom sheet |

### Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/deck` | 60 req/user | 1 hour |
| `POST /api/pantry/parse` | 10 req/user | Session |
| `POST /api/swipe` | 200 req/user | 1 hour |
| Gemini API | 200 calls total | 1 hour (across all use cases) |
| OTP send | 3 attempts/phone | 15 min |

### Infrastructure

```
Hosting:        Cloudflare Pages (@astrojs/cloudflare adapter)
DB:             Supabase (ap-southeast-1, Singapore)
Cache:          Upstash Redis (ap-southeast-1)
CDN / Storage:  Cloudflare R2 (zero egress to CF Pages)
Email:          Resend (transactional: receipt, onboarding)
Monitoring:     Sentry (errors) + PostHog self-hosted (product analytics)
Payments:       PayOS (VN gateway)
```

---

## 21. Delivery Phases & Launch Gates

### Phase 1 — MVP (Target: < 3 months to soft launch)

| Module | Deliverables | Gate |
|---|---|---|
| **Foundation** | Knowledge Base 150+ dishes · Ingredient mapping · Rule Engine (gout · tiểu đường · huyết áp · dạ dày · mỡ máu · suy thận) · Dietitian verification · Family Profile onboarding (S-01 → S-04b) | 150 dishes, image_status=ready + dietitian_verified |
| **Swipe UX** | Swipe card UI · Haptic ≤ 300ms · First card health tags · Tủ Lạnh mode (persistent pantry) · S-07 strikethrough · Bottom nav (Hôm nay · Gia đình · Cài đặt · Dinh Dưỡng) | Swipe working on Android mid-range (Snapdragon 450) |
| **Memory + Emotional UX** | Behavioral memory · Cooldown · Ngày Chăm Sóc counter · S-07 recognition copy (12 variants) · Memory Engine signal (bữa thứ 10+) · Touch Points A + B · Opt-in reminder (user-set, not default push) | Day-7 session test: recognition copy firing correctly |
| **Monetization** | Trial 14 days · Paywall S-12a..d · PayOS integration · Receipt email | End-to-end payment flow tested (test mode → prod) |
| **Distribution** | Dinh Dưỡng Blog W-07 (3+ clusters, 20+ articles) · TikTok demo content · Referral program | Blog indexed by Google (Search Console verify) |

### Hard Launch Gate

> **Do not launch with < 150 dishes where `image_status = 'ready'` AND `dietitian_verified = true`.** Below this threshold: deck repetition too high in first 5 days → churn before Memory Engine builds data.

### Phase 2 — After Day-30 Cohort ≥ 200 Users

> **Do not build any Phase 2 feature until this gate is reached and this section is explicitly expanded with schema + API contracts.**

- `POST /api/affiliate/order-redirect` + `GET /api/affiliate/partners` — ShopeeFood/Grab deep-link ordering from S-07 Meal Summary. Triggered at 1.000 paying users.
- `GET /api/rewards/weekly-card` + `family_reports` weekly row generation — Sunday 20:00 cron job, Cloudflare Worker + Canvas PNG render, INSERT `family_reports` WHERE `report_type = 'weekly'`
- `GET /api/rewards/monthly-report` + `family_reports` monthly row generation — last day of month cron, same pipeline
- `GET /app/family-journal` (S-R03) — Sổ Gia Đình archive screen, reads `family_reports` table
- `GET /api/user/data-export` — full JSON export of user data (NĐ13 right to access)
- `DELETE /api/user/account` hard delete path — background job within 30 days (NĐ13 RTBF)
- `reluctant_accept` swipe signal (-0.05 score) in Memory Engine — statistically noisy at low user counts, defer until cohort ≥ 200
- Memory Engine Phase 3 recognition copy variants (Section 18 Phase 2 additions)

### Phase 3 — After Revenue Signal Confirmed

> **Do not build any Phase 3 feature until revenue signal is confirmed and this section is expanded.**

- React Native app — only if Day-30 retention > 40% on PWA. Schema/API unchanged; new client only.
- Dinh Dưỡng Blog scale to 100+ articles — content ops expansion, no new tech required
- `POST /api/affiliate/meal-kit` + grocery delivery integration — new affiliate partner schema required
- `GET /api/blog/clusters/suy-than` — suy_than SEO cluster (deferred from Phase 1, clinical intent validation needed first)


## 22. Risks & Mitigations

| ID | Risk | Mitigation | Severity |
|---|---|---|---|
| R-01 | **Rule Engine inaccuracy** — health constraint error → unsafe food suggestion for patients | Peer review all rules with licensed dietitian. 100% unit test coverage on Rule Engine. Disclaimer on all health-filtered results. Version control rules + audit log. | HIGH |
| R-02 | **Low trial-to-paid conversion** — app perceived as free-category | Value anchor before price (meals received). "~4.600đ/ngày · rẻ hơn 1 ly trà đá" anchor. Gói 6T (990k) as low entry point. A/B test pricing if < 10% conversion after 500 trials. | HIGH |
| R-03 | **Knowledge base quality** — nutritional data inaccuracy for regional/home-cooked dishes | Source: Viện Dinh Dưỡng QG + USDA adapted. Start 300 most common dishes (80% meal frequency). Confidence score on uncertain data. Dietitian review before publish. | MED |
| R-04 | **PWA adoption friction** — VN users unfamiliar with "Add to Home Screen" on Android/iOS | In-app install prompt after session 2. iOS: explicit Share → Add to Home Screen guidance. Track install rate; < 20% → native app Phase 3. | MED |
| R-05 | **Gemini API cost at scale** — LLM cost spike if cache misses high | Persistent pantry reduces hash variation vs. session-only → better cache hit rate on adaptation. Recipe tips cached 7 days. Total < $60/month at 3k users. Rate limit: 200 Gemini calls/hour. | MED |
| R-06 | **Competitor clone** — Cookpad VN or startups copy swipe mechanic + VN food DB | Moat: behavioral data flywheel (switching cost grows with time), hard-coded rule engine (6–9 months to replicate correctly), SEO content cluster (domain authority accumulates). Execute Phase 1 in < 3 months. | MED |
| R-07 | **Legal: cross-border data transfer (Singapore)** — NĐ13 may require data residency in Vietnam | Engage legal counsel before launch to confirm Singapore jurisdiction acceptable. Fallback: ViettelIDC / FPT Cloud if required. | MED |
| R-08 | **Pantry stale data UX** — persistent pantry shows wrong ingredients → bad coverage scores | Stale nudge at 3 days. Auto-disable toggle at 5 days stale. User must re-confirm pantry to re-enable. Coverage score failure is graceful: falls back to normal deck. | LOW |

### Open Questions (Pre-Dev Kickoff)

1. **Nutrition data license:** confirm partnership/license with Viện Dinh Dưỡng QG or use public dataset?
2. **PayOS merchant account:** verification takes 2–4 weeks in VN — initiate in parallel with Phase 1 dev.
3. **Domain + DNS:** hnag.vn — registered? Point to Cloudflare Pages (CNAME `pages.dev`). SSL automatic via Cloudflare.
4. **Dietitian reviewer:** freelance contract must be confirmed before data entry begins.
5. **Legal review NĐ13:** Singapore data residency confirmation required before storing health data.

---

*Hôm Nay Ăn Gì? — Technical Specification v3.1 · March 2026 · Internal Use Only*
*Based on: Northstar v1.1 · Wireframes PWA v4.4 · Emotional Design System · UI Design System v2 · Food Photo System v1.1 · Health Rule Engine v2.0*
