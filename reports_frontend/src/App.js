import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import MyReports from './pages/MyReports';
import TeamReports from './pages/TeamReports';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import { applyLightTheme } from './theme/theme';

/**
 * PUBLIC_INTERFACE
 * App entrypoint with routing and layout shell.
 * Routes:
 *  - / (Dashboard)
 *  - /submit
 *  - /my-reports
 *  - /team-reports
 *  - /insights
 *  - /settings
 */
function App() {
  useEffect(() => {
    applyLightTheme();
  }, []);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submit" element={<SubmitReport />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/team-reports" element={<TeamReports />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
