# Sprint 1 Handoff Checklist

**Phase 6 Gate — Do not start building until every item is checked.**

Run this checklist before beginning Phase 7 (Cursor Build: Tier 1).

---

## Artifacts (Phases 1–5)

- [ ] **Northstar onepager** (HTML) — business concept, user, revenue, moat locked
- [ ] **UI Design System** (TSX) — tokens, components, token approach (A or B) defined
- [ ] **Emotional Design System** (HTML) — voice, copy formula, forbidden patterns
- [ ] **Lo-fi Wireframes** (HTML) — Tier 1 complete; Tier 2/3 designed and parked in same file
- [ ] **Tech Spec** (tech-spec.md) — stack, schema, API contracts, auth, env vars, Out of Scope
- [ ] **Screen Specs** — one .md per Tier 1 screen; all written before Sprint 1

---

## Cursor Setup (Phase 6)

### Part A — Cursor Rules (.mdc)

- [ ] `.cursor/rules/project.mdc` — `alwaysApply: true`, project + stack + out of scope + LLM ceiling filled
- [ ] `.cursor/rules/design-system.mdc` — globs: `src/components/**/*`
- [ ] `.cursor/rules/copy-rules.mdc` — globs: `src/**/*.tsx`, emotional design content pasted
- [ ] `.cursor/rules/backend.mdc` — globs: `src/api/**/*`, `src/lib/**/*`
- [ ] `.cursor/rules/testing.mdc` — manual only (call with `@testing` before commit)

### Part B — MCP Servers

- [ ] **Global** (~/.cursor/mcp.json): Context7 + GitHub (tokens set)
- [ ] **Per-project** (.cursor/mcp.json): Supabase (dev only) + Vercel + Playwright
- [ ] `.cursor/mcp.json` is in `.gitignore` (never committed)
- [ ] `.env.example` documents all required MCP/app tokens (values redacted)

### Part C — Agent Skills

- [ ] `npx skills add vercel-labs/agent-skills` — run once per project
- [ ] `npx skills add supabase/agent-skills` — run once per project
- [ ] Skills present under `.agents/skills/` or equivalent

---

## Smoke Check — First Session Ready

- [ ] Open a **new** Cursor Composer session
- [ ] Confirm project + design-system + copy-rules load for a Tier 1 screen file
- [ ] Prompt ready: *"Build [screen name] per the screen spec. Match design system tokens. Apply copy rules to all dynamic text. use context7"*
- [ ] @testing checklist will be run before committing each screen

---

## Sign-off

When all boxes are checked, Sprint 1 (Phase 7 — Tier 1 build) can begin.

**Rule:** One screen per Cursor chat session. One component per file. Build current tier only.
