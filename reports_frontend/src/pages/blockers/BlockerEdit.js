import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlockerForm from "./BlockerForm";
import { blockers as blockersApi } from "../../api/client";
import { Button, Toast } from "../../components/ui";

/**
 * Edit an existing blocker; loads current values and saves updates.
 */

// PUBLIC_INTERFACE
export default function BlockerEdit() {
  /** Edit blocker page */
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await blockersApi.getBlocker(id);
        if (active) setInitial(data || {});
      } catch (e) {
        if (active) setError(e?.message || "Failed to load blocker");
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
      await blockersApi.updateBlocker(id, payload);
      setToast("Changes saved.");
      setTimeout(() => setToast(""), 2000);
      navigate(`/blockers/${encodeURIComponent(id)}`);
    } catch (e) {
      setError(e?.message || "Failed to save blocker");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Blocker</h2>
          <Button variant="ghost" onClick={() => navigate(`/blockers/${encodeURIComponent(id)}`)}>Cancel</Button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {!loading && <BlockerForm initial={initial} onSubmit={handleSubmit} submitting={saving} mode="edit" />}
      </div>
      {toast && <Toast onClose={() => setToast("")}>{toast}</Toast>}
    </div>
  );
}
