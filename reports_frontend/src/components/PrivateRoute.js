import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute wraps routes that require authentication.
 * If unauthenticated, redirects to /login with a redirect back param.
 */

// PUBLIC_INTERFACE
export default function PrivateRoute() {
  /** Enforces authentication and optionally shows a loading placeholder while initializing. */
  const { token, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="container">
        <div className="card">
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  return <Outlet />;
}
