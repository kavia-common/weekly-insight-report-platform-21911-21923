import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportsList from "./pages/reports/ReportsList";
import ReportCreate from "./pages/reports/ReportCreate";
import ReportDetail from "./pages/reports/ReportDetail";
import ReportEdit from "./pages/reports/ReportEdit";

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
    <div className="App">
      <BrowserRouter>
        <nav className="navbar">
          <div className="navbar-inner container">
            <div className="brand">
              <span className="brand-dot" />
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                DigitalT3
              </Link>
            </div>
            <div className="nav-links">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" to="/reports">
                Reports
              </NavLink>
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title="Toggle theme"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Legacy wrapper route */}
            <Route path="/reports" element={<Reports />} />
            {/* Explicit CRUD routes */}
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/reports/new" element={<ReportCreate />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/reports/:id/edit" element={<ReportEdit />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
