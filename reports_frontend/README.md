# DigitalT3 Unified Reports Frontend

This is the unified frontend after merging the former FrontendService into `reports_frontend`.

- Port: 3000
- Theme: Ocean Professional
- Routing: React Router v6
- Node: CRA (react-scripts)
- Start: `npm start`

Environment:
- Copy `.env.example` to `.env` and set values:
  - `REACT_APP_API_BASE_URL` — base URL of your backend API
  - `REACT_APP_SITE_URL` — used for auth redirects (e.g., Supabase)

Scripts:
- `npm start` — Starts dev server on port 3000
- `npm run build` — Production build
- `npm test` — Tests

Notes:
- All new pages should be registered via React Router in `src/App.js`.
- API calls should use the helper in `src/api/client.js`.
