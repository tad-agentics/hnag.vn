---
name: Blog with Ghost CMS
overview: "Use Ghost as the headless CMS for the W-07 Dinh Dưỡng blog: Content API for posts/tags, env vars, W-07/W-07b wiring, and optional webhook for cache purge."
todos: []
isProject: false
---

# Blog integration with Ghost (headless CMS)

Use [Ghost](https://ghost.org/) as the single source of truth for the Dinh Dưỡng blog (W-07 hub and W-07b article detail). Ghost exposes a read-only [Content API](https://ghost.org/docs/content-api/javascript/) and an official JavaScript client; the app will fetch posts and render them with existing routes and SEO behaviour unchanged.

---

## 1. Ghost setup and env vars

- **Ghost instance:** Use [Ghost(Pro)](https://ghost.org/pricing/) or self-hosted Ghost. Ensure the site is reachable (e.g. `https://blog.hnag.vn` or a Ghost(Pro) URL).
- **Content API key:** In Ghost Admin go to **Settings → Integrations → Add custom integration**. Create an integration and copy the **Content API key** (read-only, safe for frontend if you prefer; for SSG/build-time fetch it can be server-only).
- **Env vars** (add to [docs/tech-spec.md](docs/tech-spec.md) §05b and `.env.example`):
  - `GHOST_URL` (or `PUBLIC_GHOST_URL`) — Ghost site URL, e.g. `https://blog.hnag.vn` or `https://your-site.ghost.io`
  - `GHOST_CONTENT_API_KEY` — Content API key from the custom integration (server-only if fetch runs in API/build; optional public if client fetches with cache)
- **Version:** Use `version: "v6.0"` (or the API version your Ghost instance supports) when initialising the client.

---

## 2. Install client and data layer

- **Package:** `npm install @tryghost/content-api`
- **Thin client layer** (e.g. `src/lib/ghost.ts` or `src/app/lib/ghost.ts`):
  - Initialise `GhostContentAPI` with `url`, `key`, `version`.
  - Expose:
    - **List posts:** `posts.browse({ limit, page, include: 'tags,authors', filter: 'tag:...', order: 'published_at DESC' })` for hub and category filters.
    - **Single post by slug:** `posts.read({ slug }, { formats: ['html'] })` for W-07b article detail.
  - Map Ghost **tags** to W-07 category pills (e.g. tag slugs `gout`, `tieu-duong`, `huyet-ap`, `da-day`, `mo-mau`, `gan-nhiem-mo`, `giam-can`, etc.). Use `filter: 'tag:slug'` for category-filtered lists.
  - Normalise response to a small type (e.g. `id`, `slug`, `title`, `html`, `published_at`, `feature_image`, `tags`, `primary_author`) so the UI stays CMS-agnostic.

---

## 3. Wire W-07 hub and W-07b to Ghost

- **W-07 Hub** ([src/app/pages/NutritionBlog.tsx](src/app/pages/NutritionBlog.tsx)):
  - Replace mock/static data with Ghost: fetch posts (and optionally tags) at build time (SSG) or on load with caching. Keep existing category filter pills; drive them from Ghost tags (or a fixed list that maps to Ghost tag slugs).
  - Keep SEO: meta title/description, canonical URL, Open Graph. Use first post or a configured "featured" post for the hero.
- **W-07b Article detail** (existing article route, e.g. `/dinh-duong/[slug]`):
  - Fetch post by slug via `posts.read({ slug })`. Render `html` in a sanitized container (e.g. use a small HTML sanitizer for safety). Keep structured data (JSON-LD Article/MedicalWebPage), breadcrumbs, and in-article CTAs per tech-spec §13.
- **Build/SSG:** If using Vite/React SSG or a static build, call the Ghost client at build time to generate hub + article pages; otherwise fetch on demand and cache (e.g. `Cache-Control` + optional revalidate). Ensure `GHOST_URL` and `GHOST_CONTENT_API_KEY` are available in the build environment if you pre-render.

---

## 4. Optional: webhook for "on-demand purge after CMS publish"

- In Ghost Admin: **Settings → Integrations → your custom integration → Webhooks**. Add a webhook that fires when a post is published/updated (e.g. `post.published`, `post.updated`).
- Target: your own endpoint (e.g. `POST /api/webhooks/ghost`) that:
  - Verifies the payload (Ghost can send a secret; validate it).
  - Triggers a rebuild (e.g. Vercel/Netlify "deploy hook") or purges the blog cache so the next request gets fresh data. This satisfies the spec's "on-demand purge after CMS publish" without Ghost-specific ISR.

---

## 5. Supabase `blog_articles` and docs

- Treat Ghost as the single source of truth. Document that the `blog_articles` table in Supabase is **not** used for blog content (or reserve it for a future sync/cache if needed). No duplicate editorial content in both Ghost and Supabase.
- In the main remaining to-dos plan, section **7. Blog and content** can be updated to "Blog with Ghost" with these concrete steps (env vars, `@tryghost/content-api`, tag → category mapping, W-07/W-07b wiring, webhook optional).

---

## Summary


| Step | Action                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------ |
| 1    | Create Ghost site + Custom Integration; add `GHOST_URL`, `GHOST_CONTENT_API_KEY` to env and §05b.            |
| 2    | Add `@tryghost/content-api`, create `src/lib/ghost.ts` (browse/read, tag → category mapping).                |
| 3    | Wire [NutritionBlog.tsx](src/app/pages/NutritionBlog.tsx) and article detail to Ghost; keep SEO and filters. |
| 4    | (Optional) Ghost webhook → your API → rebuild or cache purge.                                                |
| 5    | Document that `blog_articles` is unused; update main plan to "Ghost" instead of generic CMS.                 |


No change to routes or to the number of screens; only the data source for the blog switches from Supabase (or mock) to Ghost's Content API.
