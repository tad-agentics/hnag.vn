# Hôm Nay Ăn Gì? (HNAG) — hnag.vn

Vietnamese AI-powered family meal planning PWA. Swipe-to-decide món Việt with health rules, Tủ Lạnh mode, and behavioral memory.

## Repo status

- **Phases 1–4 (RAD):** Done — Northstar, UI Design System, Emotional Design System, and lo-fi wireframes were used to build the front-end (Figma Make export). That front-end is in this repo.
- **Phase 5:** Ready — tech spec and project rules are in place. Next: write **screen specs** (one .md per Tier 1 screen) and expand tech-spec Out of Scope as needed.
- **Phase 6:** Cursor rules (`.cursor/rules/*.mdc`), MCP template (`.cursor/mcp.json`), agent skills, and `sprint-1-handoff-checklist.md` are set. Run the checklist before Sprint 1.

## Key docs

| Doc | Purpose |
|-----|--------|
| **docs/README.md** | **Full project docs index** — tech-spec, screen specs, Northstar, Emotional/UI Design System, wireframes, Food Photo System |
| **docs/tech-spec.md** | Technical specification v3.x — stack, schema, API, env vars, Phase 2/3 gates |
| **docs/screen-specs/hnag-screen-specs-figma-make.md** | Screen specs for 40 screens (W-01 → S-R03); base for Phase 5 atomic specs |
| **docs/artifacts/** | Northstar, Emotional Design System, UI Design System v2, Wireframes PWA v4.4, Food Photo System v1.1 (HTML) |
| **guidelines/Guidelines.md** | UI Design System as Markdown (tokens, typography, components); used by Cursor |
| **sprint-1-handoff-checklist.md** | Phase 6 gate — run before first build session |

## Run the app

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. http://localhost:5173).

## Stack (current)

- **Frontend:** Vite 6, React 18, React Router 7, Tailwind 4, Radix/shadcn-style UI, Lucide. PWA: `public/manifest.json` + service worker.
- **Design:** Tokens and components in `src/styles/theme.css`; rules in `guidelines/Guidelines.md`.
- **Target (tech-spec):** Astro 4 + React Islands, Supabase, Upstash Redis, Cloudflare R2/Pages, PayOS, Gemini 2.5 Flash. See docs/tech-spec.md.

## License & attributions

- UI components: shadcn/ui (MIT). See ATTRIBUTIONS.md.
- Figma design: [HNAG v1](https://www.figma.com/design/VtVMAEPHDDgAL2IqW9sSEA/HNAG-v1).
