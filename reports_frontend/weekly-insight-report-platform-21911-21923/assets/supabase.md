# Supabase Integration Guide (reports_frontend)

This frontend integrates directly with Supabase (no backend proxy). It uses the official @supabase/supabase-js client.

Environment variables:
- REACT_APP_SUPABASE_URL — Supabase project URL
- REACT_APP_SUPABASE_KEY — Supabase anon/public API key
- REACT_APP_SITE_URL — site base URL for auth email redirects (if/when auth flows are enabled)

Notes:
- Do not rename environment variables.
- Place values in `.env` (see container_env provided to the orchestrator).

Client setup:
- The client is initialized in `src/lib/supabaseClient.js`.
- If either env var is missing, the client is not created and code falls back to HTTP API (if available).
- `isSupabaseConfigured()` determines if Supabase is active.

Tables:
- Default table names are configured in `src/lib/supabaseClient.js` via `TABLES`.
  - reports
  - blockers
  - users (reserved for future use)
- If your tables use different names or column names, update `TABLES` and adjust payload shaping in:
  - `src/services/reports.js`
  - `src/services/blockers.js`

Services:
- `src/services/reports.js` implements: listReports, createReport, getReportById, updateReport, deleteReport.
- `src/services/blockers.js` implements: listBlockers, getBlockerById, createBlocker, updateBlocker, deleteBlocker.
- All services perform basic error handling and support simple pagination (page/pageSize).

UI wiring:
- Pages call methods in `src/api/client.js`.
- That module delegates to the Supabase services when `isSupabaseConfigured()` is true.
- This ensures no code changes are needed in UI pages or tests to switch between HTTP API and Supabase.

Schema assumptions (adjust as needed):
- reports:
  - { id, content, status, week, blockers (json[] or text), created_at, updated_at, user_id? }
- blockers:
  - { id, title, description, status, priority, owner_id, report_id?, created_at, updated_at }
  - status: one of open, in_progress, closed (extend as needed)
  - priority: one of low, medium, high (extend as needed)
  - owner_id: string/uuid, FK to users if you maintain a users table
  - report_id: optional link to a specific report
- For `blockers`, only `title` and `description` are strictly required by the UI; others are optional but recommended.

Auth:
- This codebase currently uses a token-based placeholder auth for some tests.
- When migrating to Supabase Auth, ensure `emailRedirectTo` uses `REACT_APP_SITE_URL` for email link redirects.

Security:
- Never commit real keys. Keys must be injected via environment variables.
- Use Row Level Security (RLS) in Supabase and policies appropriate to your application's roles.

Troubleshooting:
- If Supabase env vars are missing, UI falls back to HTTP API calls. Ensure a backend exists in that mode or set the env vars.
- Check browser console for Supabase errors; messages are propagated via thrown Error instances.
