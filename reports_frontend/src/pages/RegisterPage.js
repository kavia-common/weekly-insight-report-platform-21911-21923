import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

/**
 * RegisterPage allows new users to create an account.
 * - Validates name/email/password and confirm password
 * - On success, persists token (via AuthContext.register) and redirects
 */

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration page UI wired to AuthContext.register */
  const { register, error: authError, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
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
    if (!values.name || values.name.trim().length < 2) e.name = "Enter your name.";
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) e.email = "Enter a valid email.";
    if (!values.password || values.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (values.password !== values.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;
    setSubmitting(true);
    const res = await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
    setSubmitting(false);
    if (res.ok) {
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate(redirect || "/profile", { replace: true }), 400);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Create account</h2>
        {authError && <p style={{ color: "var(--color-error)" }}>{authError}</p>}
        {message && <p style={{ color: "var(--color-success)" }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Full name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="Your name"
            error={errors.name}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            placeholder="you@company.com"
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            placeholder="••••••••"
            error={errors.password}
          />
          <Input
            label="Confirm password"
            type="password"
            value={values.confirm}
            onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))}
            placeholder="••••••••"
            error={errors.confirm}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create account"}
            </Button>
            <Link to="/login" className="nav-link" style={{ padding: 0 }}>
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
