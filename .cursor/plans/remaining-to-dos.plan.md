---
name: HNAG remaining to-dos
overview: A single plan that turns the remaining tech-spec and product gaps into a prioritized, trackable to-do list with concrete deliverables.
todos: []
isProject: false
---

# HNAG.vn — Remaining work plan (to-dos)

This plan converts the earlier gap review into a single checklist. Items are grouped by area and ordered by impact. Each todo is scoped so it can be done and checked off independently.

---

## 1. Core product (high priority)

**1.1 API layer**  
The app currently uses the Supabase client from the browser for deck, swipe, meal-plan, and profile. The spec (§16) expects an API layer (e.g. Astro `src/pages/api/`* or a small Node server) for: `POST /api/deck`, `POST /api/swipe`, `POST /api/meal-plan`, `GET/PUT /api/user/profile`, `POST /api/user/avatar`, plus auth/trial checks before serving app content.  

- **Todo:** Introduce API routes and move deck/swipe/meal-plan and profile/avatar writes behind them; keep Supabase (or server-side client) only on the server.

**1.2 S-03 onboarding: 9 health chips**  
S-03 currently has 5 chips. Spec v3.1 requires 9: Gout, Mỡ máu cao, Dạ dày, Tiểu đường, Huyết áp, **Gan nhiễm mỡ**, **Suy thận**, **Muốn giảm cân**, **Không có**. Map chip ids to DB `health_conditions` (e.g. `da_day` → `gastritis`, `tieu_duong` → `diabetes`) and persist.  

- **Todo:** Add the four missing chips to [src/app/pages/onboarding/S-03-HealthSetup.tsx](src/app/pages/onboarding/S-03-HealthSetup.tsx) and ensure sync with [src/app/lib/onboarding.ts](src/app/lib/onboarding.ts) and `family_members.health_conditions`.

**1.3 Swipe cards: health badges**  
Deck already returns `healthAction`, `healthTooltip`, `healthTooltipDetail`, `memberAdaptations`. The Home swipe UI does not render them. Per §06: show **adapt** pill (e.g. "Điều chỉnh cho {memberName}" or beo_phi copy), **caution** pill ("Dùng lượng nhỏ" + optional detail on tap); no pill for allow.  

- **Todo:** In the Home swipe card component, render pills from `DishCard.healthAction` / `healthTooltip` / `healthTooltipDetail` / `memberAdaptations` per Pill Rendering Contract.

**1.4 History (S-10): real data**  
History uses mock `historyEntries`. It should read from Supabase `meal_plans` (and dish details) for the logged-in user, with date range filters.  

- **Todo:** Replace mock data in [src/app/pages/app/History.tsx](src/app/pages/app/History.tsx) with queries to `meal_plans` (and dishes); support week/month filters and correct date formatting.

**1.5 Empty deck handling**  
When the deck is empty after health + cooldown, show a template message (no LLM). Spec §07: template matrix, allowed actions (e.g. relax_budget, change_slot, manual_input, relax_cooldown, disable_fridge); server can validate action.  

- **Todo:** Add empty-deck detection in deck flow, a small template message module (e.g. `lib/deck/emptyDeckMessage.ts`), and UI on Home for empty state with allowed actions.

**1.6 Care days counter and job**  
`care_days_count` is in profile and used for recognition copy but is never updated. Spec §17: nightly job sets `users.care_days_count = COUNT(DISTINCT meal_date)` from `meal_plans` where `status = 'completed'`.  

- **Todo:** Implement a scheduled job (e.g. Supabase Edge or cron) that updates `users.care_days_count` per user from completed meal_plans; ensure `meal_plans.status` can be set to `completed` where the product flow requires it.

---

## 2. Payments and trial

**2.1 PayOS integration**  

- **Todo:** Add `POST /api/payment/create-order` (plan_type → PayOS order, return checkout URL) and `POST /api/payment/webhook` (HMAC verify, update `subscriptions` and `users.subscription_status` / `plan_type` / `subscription_expires_at`). Wire PaywallScreen to create-order and post-payment redirect.

**2.2 Trial expiry job**  

- **Todo:** Add hourly job (§17): if `trial_started_at + 14 days <= NOW()` and `subscription_status = 'trial'`, set `subscription_status = 'expired'`.

---

## 3. Tủ Lạnh (fridge mode)

**3.1 Pantry persistence**  
App does not yet use `pantry_items`. Spec: persistent pantry per user; stale nudge after 3 days, auto-disable after 5 days.  

- **Todo:** Implement load/save of `pantry_items` for the current user; wire Tủ Lạnh UI and (if applicable) user_settings flags for stale/auto-disable per §17.

**3.2 Fridge coverage in deck**  
When fridge mode is on, deck should compute coverage (required vs matched ingredients), set `fridgeTier` and `missingIngredients` on DishCards, and filter/sort by tier.  

- **Todo:** In deck generation, when pantry mode is on, compute per-dish coverage from `pantry_items` and dish ingredients; attach tier and missing list to cards and apply spec filter/sort.

---

## 4. LLM and adaptation (optional for Phase 1)

**4.1 LLM adaptation pre-generation**  
Spec §07 Step 3c: for dishes with rule result `adapt`, pre-generate adaptation copy via LLM and cache; use for bottom sheet when user taps adapt pill.  

- **Todo:** Add server/API path that calls Gemini (or other) for adapt steps; cache result; Home adapt pill tap loads from cache (no on-tap LLM call).

**4.2 Pantry parse API**  

- **Todo:** Add `POST /api/pantry/parse` (body `raw_text`), call LLM for NLP parsing, return structured chips; rate limit per spec.

---

## 5. PWA and offline

**5.1 Service worker and caching**  
`public/sw.js` is minimal. Spec §14 expects a proper strategy (e.g. Workbox): precache critical routes/assets, runtime caching (e.g. network-first for API, cache-first for static).  

- **Todo:** Replace or extend [public/sw.js](public/sw.js) with Workbox (or equivalent) and strategy that meets PWA/offline goals (e.g. history/recipes viewable offline).

**5.2 Web app manifest**  

- **Todo:** Ensure a valid `manifest.json` (or equivalent) exists with name, short_name, icons, start_url, display, theme colors for install and splash.

---

## 6. Food Photo Generation Pipeline (tech-spec §12)

**Offline batch only.** Never at runtime. Pipeline runs per dish; after upload to R2 and `dishes.image_status = 'ready'`, the image is canonical (no auto-regeneration). App only reads `image_url` from DB. Launch gate: **150+ dishes** with `image_status = 'ready'` and dietitian_verified.

**6.1 Admin image API endpoints**  
Spec §12: admin-only endpoints for pipeline and QC.  

- **Todo:** Add `PATCH /api/admin/dish/:id/reset-image` (body `{ confirm: true }`) to set `image_status = 'pending'`, clear `image_url` and `image_generated_at`; add `GET /api/admin/dishes/image-status` returning counts per status (pending/generating/ready/failed). Enforce admin auth (e.g. `users.is_admin` or dedicated admin role).

**6.2 R2 upload and dish update**  
Pipeline must upload generated image to Cloudflare R2 and update the dish row.  

- **Todo:** Implement server-side R2 upload (e.g. from API route or script): WebP at `dishes/{dish_id}/hero.webp`, then UPDATE `dishes` SET `image_url`, `image_status = 'ready'`, `image_generated_at` for that dish. Use `CLOUDFLARE_R2`_* and `PUBLIC_CLOUDFLARE_R2_CDN_URL` from §05b.

**6.3 Batch generation script (admin/local)**  
Spec: Nano Banana API for image generation; run only from admin machine, `NANO_BANANA_API_KEY` in `.env.local` only (never in production env). Flow: for each dish with `image_status IN ('pending','generating')`, call API with system prompt + 5 refs + user prompt → 3 variants → human QC picks 1 → post-process (resize/WebP) → upload to R2 → update dish. If `image_status = 'ready'` → SKIP.  

- **Todo:** Add an offline admin script (e.g. `scripts/generate-dish-photos.ts` or runbook) that: reads dishes where image_status is not `ready`; calls Nano Banana (or documented alternative) with prompts; after human QC, uploads chosen image via R2 and updates DB. Document in README or [docs/artifacts/food-photo-system-v1.1.html](docs/artifacts/food-photo-system-v1.1.html) alignment.

**6.4 Reference images and prompts (operational)**  
Pipeline quality depends on 5 reference images per dish and a short user prompt (dish name + composition). Can be manual or semi-automated.  

- **Todo:** Define process or tooling for reference collection (per §12: e.g. search → AI pre-filter → human pick 5) and per-dish user prompt storage (e.g. in DB or config) so the batch script can run without ad-hoc edits.

---

## 7. Blog and content (headless CMS)

Blog content will be sourced from a **headless CMS** instead of the Supabase `blog_articles` table. W-07 Dinh Dưỡng hub and W-07b article detail stay the same (routes, SEO, logged-in personalization); only the data source changes.

**7.1 Choose CMS and add integration**  
Pick a headless CMS (e.g. Strapi, Contentful, Sanity, Payload, or Decap/Netlify CMS). Add env vars (e.g. `CMS_API_URL`, `CMS_PREVIEW_SECRET` or provider-specific keys) to §05b / `.env.example`. Implement a small client or fetch layer that loads published articles and article-by-slug from the CMS API (REST or GraphQL depending on CMS).

**7.2 Wire W-07 and W-07b to CMS**  
Replace mock/static content in [src/app/pages/NutritionBlog.tsx](src/app/pages/NutritionBlog.tsx) and article detail with fetches to the headless CMS. Keep category filter pills and SEO behaviour (meta, structured data, canonical). If using SSG: fetch at build time and optionally add webhook from CMS to trigger rebuild or cache purge (spec §13: "on-demand purge after CMS publish").

**7.3 Optional: deprecate or repurpose `blog_articles`**  
If the CMS is the single source of truth for blog content, document that `blog_articles` in Supabase is unused or reserved for a lightweight sync/cache; or remove blog from Supabase schema in a later migration. Do not duplicate editorial content in both CMS and DB.

---

## 8. Profile and settings

**8.1 Edit Profile (S-11p) persistence**  
Edit Profile currently uses a mock API and does not persist to DB.  

- **Todo:** Persist display_name, email, phone via Supabase (or `PUT /api/user/profile`). Optionally add avatar upload (e.g. R2 + `POST /api/user/avatar`) and set `users.avatar_url`.

---

## 9. Memory and touch points

**9.1 Touch Point A — cooldown toast**  
First time cooldown excludes a dish: show one-time toast (e.g. "Đã bỏ qua [món] — tuần trước vừa ăn rồi").  

- **Todo:** Implement one-time toast when cooldown first removes a dish; persist "shown" (e.g. `memory_toast_shown` in user_settings or equivalent).

**9.2 Touch Point B — Family Memory Card**  
After meal_plans count ≥ 7, show Memory Card on Home with short facts; tap → profile/edit, dismiss → re-surface in 7 days.  

- **Todo:** Add Memory Card component and logic using `memory_card_last_surfaced_at` (or similar); simple buildFacts for Phase 1.

**9.3 Recognition copy — condition and fridge variants**  
Recognition library has milestones + generic only. Spec §18 adds condition-based (gout, diabetes, hypertension) and fridge (Tier 0 all, mixed) copy.  

- **Todo:** Extend [src/app/lib/recognition-copy.ts](src/app/lib/recognition-copy.ts) context with `familyConditions` and fridge state; add Bệnh lý and Tủ Lạnh variants and selection logic.

---

## 10. Data and ops

**10.1 Popularity score job**  

- **Todo:** Add daily job (§17) to recompute `dishes.popularity_score` from `swipe_events` (e.g. last 90 days), default 0.5 for no data.

**10.2 dish_adaptations RLS**  
Confirm `dish_adaptations` is readable when deck is fetched (authenticated). If deck is ever needed for anon, add or adjust RLS.  

- **Todo:** Verify RLS for deck flow; add anon SELECT only if product requires unauthenticated deck.

---

## 11. Quality and compliance

**11.1 Tests**  
No tests exist; spec targets full coverage for the Health Rule Engine.  

- **Todo:** Add unit tests for all 9 condition evaluators and engine in [src/app/lib/health-rules/](src/app/lib/health-rules/); add integration/e2e for critical flows (auth, onboarding, swipe, summary).

**11.2 Health consent (Nghị định 13)**  
S-03 must have explicit health consent and store `health_consent_given_at` + `health_consent_version`; block health data write until consent.  

- **Todo:** Add consent checkbox to S-03, persist consent fields, and gate health writes on consent.

**11.3 Environment variables**  

- **Todo:** Document all §05b env vars in `.env.example` with short descriptions and no secrets.

---

## 12. Optional / later

**12.1 Preference score in deck sort**  
Use `user_preferences` and `popularity_score` to score/sort deck after health and cooldown.  

- **Todo:** In deck generation, add preference/popularity scoring and sort before limiting to 8 cards.

**12.2 Preference score decay**  
Spec §08: weekly decay (e.g. 0.95).  

- **Todo:** Apply decay in preference update path or in a nightly job.

**12.3 S-07 Summary: real total time and cost**  
Replace mock `totalTime` / `totalCost` with values derived from selected dishes (cook_time_minutes, budget_tier).  

- **Todo:** Compute and display real totals on [src/app/pages/app/Summary.tsx](src/app/pages/app/Summary.tsx) from slot dishes.

**12.4 Recipe screen and adapt sheet**  
Ensure Recipe (S-06) loads dish from DB and that tapping the adapt pill on a card opens the adaptation bottom sheet with steps.  

- **Todo:** Wire Recipe to dish id and ensure adapt pill opens sheet with `memberAdaptations` / pre-generated copy.

---

## Summary


| Area                 | Count | Focus                                                                         |
| -------------------- | ----- | ----------------------------------------------------------------------------- |
| Core product         | 6     | API, onboarding chips, health badges, History, empty deck, care_days job      |
| Payments / trial     | 2     | PayOS, trial expiry job                                                       |
| Tủ Lạnh              | 2     | Pantry persistence, fridge coverage in deck                                   |
| LLM                  | 2     | Adapt pre-gen, pantry parse API                                               |
| PWA                  | 2     | SW strategy, manifest                                                         |
| **Photo generation** | **4** | **Admin image API, R2 upload, batch script, refs + prompts**                  |
| Blog                 | 3     | Headless CMS: choose CMS, wire W-07/W-07b, optional blog_articles deprecation |
| Profile              | 1     | Edit Profile + optional avatar                                                |
| Memory / touch       | 3     | Cooldown toast, Memory Card, recognition variants                             |
| Data / ops           | 2     | Popularity job, dish_adaptations RLS                                          |
| Quality              | 3     | Tests, health consent, .env.example                                           |
| Optional             | 4     | Preference sort, decay, Summary totals, Recipe/adapt sheet                    |


Total: **34 to-dos** (including 4 for Food Photo Generation and 3 for blog via headless CMS). Implementing in the order above keeps core product and payments first; photo pipeline is admin-only; blog can use any headless CMS (Strapi, Contentful, Sanity, Payload, Decap, etc.) — env vars and webhook/rebuild steps depend on the chosen CMS.
