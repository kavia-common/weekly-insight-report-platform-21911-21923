import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportsList from "./pages/reports/ReportsList";
import ReportCreate from "./pages/reports/ReportCreate";
import ReportDetail from "./pages/reports/ReportDetail";
import ReportEdit from "./pages/reports/ReportEdit";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App" data-theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          {/* Auth pages without chrome */}
          <Routes>
            <Route
              path="/login"
              element={
                <Layout hideChrome>
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout hideChrome>
                  <RegisterPage />
                </Layout>
              }
            />
          </Routes>

          {/* Main app wrapped in Layout */}
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Compatibility and explicit routes */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports" element={<ReportsList />} />
              <Route path="/reports/new" element={<ReportCreate />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/reports/:id/edit" element={<ReportEdit />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Protected profile */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Notifications placeholder route (optional existence) */}
              <Route path="/notifications" element={<div className="container"><div className="card"><h2 style={{marginTop:0}}>Notifications</h2><p>Coming soon.</p></div></div>} />

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
