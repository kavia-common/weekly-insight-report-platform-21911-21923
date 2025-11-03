# Reports Frontend (Ocean Professional)

This React app provides the UI for submitting weekly reports and viewing insights. It uses a lightweight custom theme and no external UI libs.

## Quick Start
- `npm start` to run on http://localhost:3000

## Supabase Setup (Google OAuth)
1. Environment variables (create `.env` in this folder):
   - REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   - REACT_APP_SUPABASE_KEY=YOUR-ANON-PUBLIC-KEY
   - REACT_APP_SITE_URL=http://localhost:3000
2. Supabase Dashboard
   - Authentication → Providers → Google: enable and add Client ID/Secret
   - Authentication → URL Configuration:
     - Site URL: your dev/prod URL
     - Redirect URLs:
       * http://localhost:3000/**
       * https://yourapp.com/**
3. Database
   - Run SQL in assets/supabase.md to create `reports` table and RLS
4. App
   - Settings page → “Sign in with Google”
   - Auth callback handled at `/auth/callback`

## Structure
```
src/
  assets/
    logo.svg
  components/
    common/
      Badge.js / Badge.css
      Button.js / Button.css
      Card.js / Card.css
      Input.js / Input.css
      Modal.js / Modal.css
      TextArea.js
  hooks/
    useMockReports.js
  layouts/
    MainLayout.js / MainLayout.css
  pages/
    Dashboard.js
    SubmitReport.js
    MyReports.js
    TeamReports.js
    Insights.js
    Settings.js
  routes/
    index.js
  theme/
    globals.css
    variables.css
    theme.js
  App.js
  index.js
```

## Routing
- `/` → Dashboard
- `/submit` → Submit Report
- `/my-reports` → My Reports
- `/team-reports` → Team Reports
- `/insights` → Insights
- `/settings` → Settings

## Extending
- Add API integration in pages using your data layer later (Supabase or REST).
- Theme tokens live in `src/theme/variables.css` and `src/theme/theme.js`.
- Reusable components under `src/components/common`.
- Layout is defined in `src/layouts/MainLayout.js` (sidebar + topbar).

## Accessibility
- Keyboard focus styles are enabled.
- Buttons and interactive elements include aria labels where relevant.

## Notes
- Keep dependencies minimal. `react-router-dom` is used for routing.
- Placeholder Modal is simple (no portals) to avoid extra deps.
