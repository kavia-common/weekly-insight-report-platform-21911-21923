import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReportForm from "../../components/ReportForm";
import { reports as reportsApi } from "../../api/client";
import { Button } from "../../components/ui";

// PUBLIC_INTERFACE
export default function ReportEdit() {
  /** Edit an existing report: loads data, handles update and states. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await reportsApi.getReport(id);
        if (active) setInitial(data || {});
      } catch (e) {
        if (active) setError(e?.message || "Failed to load report");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(payload) {
    setError("");
    setSaving(true);
    try {
      await reportsApi.updateReport(id, payload);
      navigate(`/reports/${encodeURIComponent(id)}`);
    } catch (e) {
      setError(e?.message || "Failed to save report");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Report</h2>
          <Button variant="ghost" onClick={() => navigate(`/reports/${encodeURIComponent(id)}`)}>Cancel</Button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {!loading && (
          <ReportForm initial={initial} onSubmit={handleSubmit} submitting={saving} mode="edit" />
        )}
      </div>
    </div>
  );
}
