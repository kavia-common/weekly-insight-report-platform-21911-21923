import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlockerForm from "./BlockerForm";
import { blockers as blockersApi } from "../../api/client";
import { Button, Toast } from "../../components/ui";

/**
 * Create a new blocker, then navigate to detail or list.
 */

// PUBLIC_INTERFACE
export default function BlockerCreate() {
  /** Create blocker page */
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    setError("");
    setSubmitting(true);
    try {
      const created = await blockersApi.createBlocker(payload);
      setToast("Blocker created successfully.");
      setTimeout(() => setToast(""), 2000);
      const id = created?.id;
      navigate(id ? `/blockers/${encodeURIComponent(id)}` : "/blockers");
    } catch (e) {
      setError(e?.message || "Failed to create blocker");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Create Blocker</h2>
          <Button variant="ghost" onClick={() => navigate("/blockers")}>Back to list</Button>
        </div>
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        <BlockerForm onSubmit={handleSubmit} submitting={submitting} mode="create" />
      </div>
      {toast && <Toast onClose={() => setToast("")}>{toast}</Toast>}
    </div>
  );
}
