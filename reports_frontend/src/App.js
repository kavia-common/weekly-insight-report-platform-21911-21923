import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

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
            <Route path="/reports" element={<Reports />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
