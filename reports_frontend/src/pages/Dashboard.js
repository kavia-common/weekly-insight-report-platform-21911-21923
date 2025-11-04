import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard placeholder page */
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Placeholder for future integration
        // const data = await apiRequest("/dashboards");
        const data = { kpis: { reportsThisWeek: 0, blockersOpen: 0 } };
        if (active) setKpis(data.kpis);
      } catch (e) {
        setError(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Dashboard</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {kpis && (
          <ul>
            <li>Reports this week: {kpis.reportsThisWeek}</li>
            <li>Open blockers: {kpis.blockersOpen}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
