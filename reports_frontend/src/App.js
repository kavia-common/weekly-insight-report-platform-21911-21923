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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

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

  function AuthNav() {
    const { token, user, logout } = useAuth();
    if (!token) {
      return (
        <div className="nav-links">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/register">
            Register
          </NavLink>
        </div>
      );
    }
    return (
      <div className="nav-links">
        <NavLink className="nav-link" to="/profile">
          {user?.name ? `Hi, ${user.name}` : "Profile"}
        </NavLink>
        <button className="theme-toggle" onClick={logout} title="Logout">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
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
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <AuthNav />
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  title="Toggle theme"
                >
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
              </div>
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

              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected profile route */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
