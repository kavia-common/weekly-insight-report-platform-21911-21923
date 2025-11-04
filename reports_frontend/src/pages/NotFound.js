import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";

/**
 * NotFound renders a friendly 404 page with quick navigation back home or reports.
 */

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page */
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <h2 style={{ marginTop: 0 }}>Page not found</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link to="/"><Button variant="secondary">Go home</Button></Link>
          <Link to="/reports"><Button>Browse reports</Button></Link>
        </div>
      </div>
    </div>
  );
}
