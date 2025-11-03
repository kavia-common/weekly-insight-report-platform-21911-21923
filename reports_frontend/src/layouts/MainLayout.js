import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainLayout.css';

/**
 * PUBLIC_INTERFACE
 * MainLayout renders the shell with a left sidebar and a top bar.
 * Contains:
 *  - App title
 *  - Navigation links
 *  - Team selector placeholder
 *  - User avatar placeholder
 */
export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <div className="logo" aria-hidden="true">📘</div>
          <div className="brand-text">
            <div className="brand-title">Weekly Reports</div>
            <div className="brand-sub">Ocean Professional</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">🏠</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">✍️</span>
            <span>Submit Report</span>
          </NavLink>
          <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">📄</span>
            <span>My Reports</span>
          </NavLink>
          <NavLink to="/team-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">👥</span>
            <span>Team Reports</span>
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">📈</span>
            <span>Insights</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span aria-hidden="true">⚙️</span>
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar" role="banner">
          <div className="topbar-left">
            <h1 className="topbar-title">DigitalT3 Weekly Report Platform</h1>
          </div>
          <div className="topbar-right">
            <div className="team-select" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-label="Team selector">
              <span className="dot" /> Team Alpha ▾
            </div>
            <div className="avatar" role="img" aria-label="User avatar">JD</div>
          </div>
        </header>

        <main className="content" role="main" aria-live="polite">
          {children}
        </main>
      </div>
    </div>
  );
}
