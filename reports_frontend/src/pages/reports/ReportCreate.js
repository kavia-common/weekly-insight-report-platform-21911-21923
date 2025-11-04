import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../../components/ReportForm";
import { reports as reportsApi } from "../../api/client";
import { Button } from "../../components/ui";

// PUBLIC_INTERFACE
export default function ReportCreate() {
  /** Create new report page with client-side validation and loading/error states. */
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    setError("");
    setSubmitting(true);
    try {
      const created = await reportsApi.createReport(payload);
      const id = created?.id;
      // Navigate to detail if id available, otherwise back to list
      navigate(id ? `/reports/${encodeURIComponent(id)}` : "/reports");
    } catch (e) {
      setError(e?.message || "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Create Report</h2>
          <Button variant="ghost" onClick={() => navigate("/reports")}>Back to list</Button>
        </div>
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        <ReportForm onSubmit={handleSubmit} submitting={submitting} mode="create" />
      </div>
    </div>
  );
}
