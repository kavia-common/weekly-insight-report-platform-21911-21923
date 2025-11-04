import React from "react";

/**
 * Minimal reusable UI components styled to match Ocean Professional theme.
 * These are intentionally simple and self-contained.
 */

// PUBLIC_INTERFACE
export function Button({ children, variant = "primary", onClick, type = "button", disabled = false, style = {}, ...rest }) {
  /** Button with primary/secondary/danger/ghost variants and focus styles */
  const colors = {
    primary: { background: "var(--button-bg)", color: "var(--button-text)" },
    secondary: { background: "rgba(37,99,235,0.08)", color: "var(--color-primary)" },
    danger: { background: "var(--color-error)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-color)" },
  };
  const base = {
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: variant === "primary" ? "0 6px 16px rgba(37, 99, 235, 0.25)" : "none",
    opacity: disabled ? 0.6 : 1,
    transition: "transform .15s ease, opacity .15s ease, box-shadow .2s ease",
    outline: "none",
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className="button"
      style={{ ...base, ...colors[variant], ...(colors[variant]?.border ? { border: colors[variant].border } : {}), ...style }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px var(--ring)`) }
      onBlur={(e) => (e.currentTarget.style.boxShadow = base.boxShadow) }
      {...rest}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function Input({ label, error, ...rest }) {
  /** Text input with label and error display */
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid var(--border-color)`,
    outline: "none",
    transition: "box-shadow .2s ease, border-color .2s ease",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <input
        {...rest}
        style={{ ...inputStyle, border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}` }}
        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px var(--ring)`)}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
      {error && <div style={{ color: "var(--color-error)", marginTop: 6, fontSize: 12 }}>{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function TextArea({ label, error, rows = 7, ...rest }) {
  /** Multi-line text area with label and error display */
  const base = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid var(--border-color)`,
    outline: "none",
    transition: "box-shadow .2s ease, border-color .2s ease",
    resize: "vertical",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <textarea
        {...rest}
        rows={rows}
        style={{ ...base, border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}` }}
        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px var(--ring)`)}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
      {error && <div style={{ color: "var(--color-error)", marginTop: 6, fontSize: 12 }}>{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Select({ label, error, children, ...rest }) {
  /** Select input with label and error display */
  const base = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid var(--border-color)`,
    outline: "none",
    transition: "box-shadow .2s ease, border-color .2s ease",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <select
        {...rest}
        style={{ ...base, border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}` }}
        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px var(--ring)`)}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      >
        {children}
      </select>
      {error && <div style={{ color: "var(--color-error)", marginTop: 6, fontSize: 12 }}>{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Badge({ children, color = "primary" }) {
  /** Small badge/pill with theme colors */
  const map = {
    primary: { background: "rgba(37,99,235,0.1)", color: "var(--color-primary)" },
    secondary: { background: "rgba(245,158,11,0.12)", color: "var(--color-secondary)" },
    error: { background: "rgba(239,68,68,0.12)", color: "var(--color-error)" },
  };
  return (
    <span style={{ ...map[color], padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

// PUBLIC_INTERFACE
export function Card({ children, style = {}, ...rest }) {
  /** Themed card container for grouping content */
  return (
    <div className="card" style={style} {...rest}>
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Table({ columns = [], data = [], rowKey = (row) => row.id || JSON.stringify(row) }) {
  /** Simple responsive table with themed styling */
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key || c.accessor} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontWeight: 700 }}>
                {c.header || c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 12, color: "var(--text-secondary)" }}>No data.</td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={rowKey(row)} style={{ borderBottom: "1px solid var(--border-color)" }}>
              {columns.map((c) => (
                <td key={(c.key || c.accessor) + String(rowKey(row))} style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)" }}>
                  {c.render ? c.render(row) : row[c.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Modal({ title, open, onClose, children, actions }) {
  /** Simple modal dialog with title, content and actions */
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "min(560px, 94vw)", padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        <div style={{ marginBottom: 14 }}>{children}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>{actions}</div>
      </div>
    </div>
  );
}
