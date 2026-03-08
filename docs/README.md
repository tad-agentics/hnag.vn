# HNAG — Project documentation

Single index for all project docs and source artifacts. Tech-spec is the build source of truth; artifacts are the design and product sources.

---

## 1. Build & implementation

| Document | Purpose | Use |
|----------|---------|-----|
| **tech-spec.md** | Technical specification v3.x — stack, schema, API, env vars, Phase 2/3 gates, Health Rule Engine, Memory Engine, PayOS, PWA, etc. | Cursor, backend, and screen specs reference this. **Source of truth for implementation.** |

---

## 2. Screen specs (Phase 5)

| Document | Purpose | Use |
|----------|---------|-----|
| **screen-specs/hnag-screen-specs-figma-make.md** | Consolidated screen specs for 40 screens/states (W-01 → S-R03). Per-screen: components, copy, routes, data. Aligned to Wireframes PWA v4.4. | Figma Make / AI screen generation; base for atomic screen-spec .md files per RAD Phase 5. |

---

## 3. Source artifacts (HTML — open in browser)

All artifacts in **artifacts/** are self-contained HTML. Open in any browser; no build step.

| File | Purpose |
|------|---------|
| **artifacts/northstar-onepager-v1.1.html** | Northstar one-pager — problem, pillars, user, revenue, moat. Lock before design. |
| **artifacts/emotional-design-system.html** | Emotional Design System — UX tone, brand voice, copy rules, persona, anti-patterns. Feeds copy-rules.mdc. |
| **artifacts/ui-design-system-v2.0.html** | UI Design System v2.0 — tokens, typography, components, anti-patterns. Companion to **guidelines/Guidelines.md** (in repo root). |
| **artifacts/wireframes-pwa-v4_4.html** | Lo-fi wireframes PWA v4.4 — clickable flow, all tiers. Screen structure and UX logic reference. |
| **artifacts/food-photo-system-v1.1.html** | Food photo generation pipeline — categories, image specs, batch workflow, admin. Tech-spec Section 12 aligns to this. |

---

## 4. In-code design system

| Location | Purpose |
|----------|---------|
| **../guidelines/Guidelines.md** | Design system as Markdown (tokens, typography, icon system, components). Used by Cursor design-system.mdc. |
| **../src/styles/theme.css** | Implemented tokens and component classes (CSS custom properties + Tailwind). Single source for app styling. |

---

## 5. RAD phase mapping

| RAD Phase | Artifact | Location |
|-----------|----------|----------|
| Phase 1 — Northstar | Northstar onepager | docs/artifacts/northstar-onepager-v1.1.html |
| Phase 2 — UI Design System | UI Design System + Guidelines | docs/artifacts/ui-design-system-v2.0.html, guidelines/Guidelines.md, src/styles/theme.css |
| Phase 3 — Emotional Design System | Emotional Design System | docs/artifacts/emotional-design-system.html |
| Phase 4 — Lo-fi Wireframes | Wireframes PWA v4.4 | docs/artifacts/wireframes-pwa-v4_4.html |
| Phase 5 — Tech Spec + Screen Specs | Tech spec, Screen specs | docs/tech-spec.md, docs/screen-specs/hnag-screen-specs-figma-make.md |
| — | Food Photo System (pipeline spec) | docs/artifacts/food-photo-system-v1.1.html |

---

## Quick links

- **Implementing a screen:** tech-spec.md §16 (API) + screen-specs doc + guidelines/Guidelines.md + theme.css  
- **Copy and voice:** emotional-design-system.html + .cursor/rules/copy-rules.mdc  
- **Product scope and gates:** tech-spec.md §01, §21  
- **Env vars:** tech-spec.md §05b; see also repo root `.env.example`
