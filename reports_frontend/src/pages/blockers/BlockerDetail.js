import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blockers as blockersApi } from "../../api/client";
import { Button, Modal, Badge, Toast } from "../../components/ui";

/**
 * Shows a single blocker and allows edit/delete.
 */

// PUBLIC_INTERFACE
export default function BlockerDetail() {
  /** Blocker detail page */
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await blockersApi.getBlocker(id);
        if (active) setItem(data);
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

  async function handleDelete() {
    try {
      await blockersApi.deleteBlocker(id);
      setToast("Blocker deleted.");
      setTimeout(() => setToast(""), 2000);
      navigate("/blockers");
    } catch (e) {
      setError(e?.message || "Delete failed");
      setConfirm(false);
    }
  }

  function badgeColorFor(s, map) {
    if (!s) return "secondary";
    const val = String(s).toLowerCase();
    return map[val] || "secondary";
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Blocker Details</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={() => navigate("/blockers")}>Back</Button>
            <Button variant="secondary" onClick={() => navigate(`/blockers/${encodeURIComponent(id)}/edit`)}>Edit</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Delete</Button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {item && (
          <div>
            <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
              ID: {item.id} • Owner: {item.owner_id || "—"} • Updated: {item.updated_at || item.created_at || "n/a"}
            </div>
            <h3 style={{ marginBottom: 6 }}>{item.title || "Untitled blocker"}</h3>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <Badge color={badgeColorFor(item.status, { open: "error", in_progress: "secondary", closed: "primary" })}>
                {item.status || "unknown"}
              </Badge>
              <Badge color={badgeColorFor(item.priority, { low: "secondary", medium: "primary", high: "error" })}>
                {item.priority || "n/a"}
              </Badge>
            </div>
            {item.description && <p style={{ whiteSpace: "pre-wrap" }}>{item.description}</p>}
          </div>
        )}
      </div>

      <Modal
        title="Delete blocker?"
        open={confirm}
        onClose={() => setConfirm(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        This action will permanently delete this blocker.
      </Modal>

      {toast && <Toast onClose={() => setToast("")}>{toast}</Toast>}
    </div>
  );
}
