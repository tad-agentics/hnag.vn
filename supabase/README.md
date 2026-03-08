# Supabase setup

**Project:** `hptovpbiwvtngorhdhhm` · URL and anon key are in `.env.local` (app) and `.cursor/mcp.json` (Supabase MCP).

## 1. Run the SQL (one-time)

1. Open the **SQL Editor** for your project:  
   **https://supabase.com/dashboard/project/hptovpbiwvtngorhdhhm/sql/new**

2. Open **`supabase/setup.sql`** in this repo, copy its full contents, and paste into the SQL Editor.

3. Click **Run** (or press Cmd/Ctrl+Enter).

4. You should see “Success. No rows returned.” The script creates all tables, RLS policies, indexes, the `handle_new_user` trigger, and seeds 5 dishes. It is idempotent: safe to run again (uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`).

## 2. Enable auth providers

In the dashboard: **Authentication → Providers** → enable **Google** (and optionally **Email**).  
Add your app URL to **Redirect URLs** if needed (e.g. `http://localhost:5173/auth/callback` for local dev).

## 3. App and MCP

- **App:** `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Restart `npm run dev` after changing env.
- **Supabase MCP (Cursor):** `.cursor/mcp.json` uses your project ref and anon key. If the MCP reports auth errors, create a **Personal Access Token** at [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) and replace the `--access-token` value in `.cursor/mcp.json`.

## Alternative: Supabase CLI

If you use the CLI and are logged in (`npx supabase login`):

```bash
npx supabase link --project-ref hptovpbiwvtngorhdhhm
npx supabase db push
```

That applies the migrations in `supabase/migrations/`. For a quick one-shot setup, the SQL Editor + `setup.sql` is enough.
