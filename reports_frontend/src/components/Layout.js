import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Layout provides the global application shell with:
 * - responsive sidebar navigation
 * - top bar with app title and user menu
 * - skip-to-content link for accessibility
 * - breadcrumb trail based on current route path
 * - mobile sidebar toggle
 * 
 * It wraps page content and applies the Ocean Professional theme.
 */

// PUBLIC_INTERFACE
export default function Layout({ children, hideChrome = false }) {
  /** Wraps routes with global navigation UI; hideChrome can suppress layout for auth pages. */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { token, user, logout } = useAuth();

  useEffect(() => {
    // Close sidebar on route change for mobile
    setSidebarOpen(false);
  }, [location.pathname]);

  const crumbs = buildBreadcrumbs(location);

  if (hideChrome) {
    // Still include skip link in case of keyboard users
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div id="main-content" tabIndex={-1}>{children}</div>
      </>
    );
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Primary">
        <div className="sidebar-header">
          <Link to="/" className="brand-link" onClick={() => setSidebarOpen(false)}>
            <span className="brand-dot" />
            <span className="brand-text">DigitalT3</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <NavItem to="/" label="Home" icon="🏠" />
          <NavItem to="/reports" label="Reports" icon="📝" />
          <NavItem to="/blockers" label="Blockers" icon="⛔" />
          <NavItem to="/dashboard" label="Dashboard" icon="📊" />
          <NavItem to="/notifications" label="Notifications" icon="🔔" />
          <NavItem to="/profile" label="Profile" icon="👤" />
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0</span>
        </div>
      </aside>

      <div className="content-area">
        <header className="topbar" role="banner">
          <button
            className="icon-button"
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>
          <div className="topbar-title">
            <span className="brand-mini-dot" />
            <span>Weekly Report Platform</span>
          </div>
          <div className="topbar-actions">
            {token ? (
              <>
                <span className="user-chip" title={user?.email || ""}>
                  {user?.name || user?.email || "User"}
                </span>
                <button className="theme-toggle" onClick={logout} title="Logout">Logout</button>
              </>
            ) : (
              <>
                <NavLink className="topbar-link" to="/login">Login</NavLink>
                <NavLink className="topbar-link" to="/register">Register</NavLink>
              </>
            )}
          </div>
        </header>

        <div className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span className="crumb-sep">/</span>}
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="crumb-current">{c.label}</span>
              ) : (
                <Link to={c.href} className="crumb-link">{c.label}</Link>
              )}
            </span>
          ))}
        </div>

        <main id="main-content" className="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      end={to === "/"}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function buildBreadcrumbs(location) {
  const parts = location.pathname.split("/").filter(Boolean);
  const crumbs = [{ href: "/", label: "Home" }];
  let href = "";
  parts.forEach((p) => {
    href += `/${p}`;
    crumbs.push({ href, label: toTitle(p) });
  });
  return crumbs;
}

function toTitle(str) {
  // Convert dynamic segments like :id to readable labels if needed
  if (/^\d+$/.test(str)) return `#${str}`;
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
