import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

/**
 * LoginPage provides email/password authentication.
 * - Validates input
 * - Shows loading/error
 * - On success, redirects to 'redirect' param or /profile
 */

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page UI wired to AuthContext.login */
  const { login, error: authError, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const redirect = new URLSearchParams(location.search).get("redirect");

  useEffect(() => {
    if (token) {
      navigate(redirect || "/profile", { replace: true });
    }
  }, [token, redirect, navigate]);

  function validate() {
    const e = {};
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      e.email = "Enter a valid email.";
    }
    if (!values.password || values.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;
    setSubmitting(true);
    const res = await login(values);
    setSubmitting(false);
    if (res.ok) {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(redirect || "/profile", { replace: true });
      }, 400);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        {authError && <p style={{ color: "var(--color-error)" }}>{authError}</p>}
        {message && <p style={{ color: "var(--color-success)" }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            placeholder="you@company.com"
            error={errors.email}
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            placeholder="••••••••"
            error={errors.password}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <Link to="/register" className="nav-link" style={{ padding: 0 }}>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
