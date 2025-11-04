import React from "react";

/**
 * Minimal reusable UI components styled to match Ocean Professional theme.
 * These are intentionally simple and self-contained.
 */

// PUBLIC_INTERFACE
export function Button({ children, variant = "primary", onClick, type = "button", disabled = false, style = {}, ...rest }) {
  /** Button with primary/secondary/danger variants */
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
    transition: "transform .15s ease, opacity .15s ease",
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className="button"
      style={{ ...base, ...colors[variant], ...(colors[variant]?.border ? { border: colors[variant].border } : {}), ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function Input({ label, error, ...rest }) {
  /** Text input with label and error display */
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <input
        {...rest}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}`,
          outline: "none",
          transition: "box-shadow .2s ease, border-color .2s ease",
        }}
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
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <textarea
        {...rest}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}`,
          outline: "none",
          transition: "box-shadow .2s ease, border-color .2s ease",
          resize: "vertical",
        }}
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
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
      <select
        {...rest}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? "var(--color-error)" : "var(--border-color)"}`,
          outline: "none",
          transition: "box-shadow .2s ease, border-color .2s ease",
          background: "var(--bg-surface)",
        }}
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
