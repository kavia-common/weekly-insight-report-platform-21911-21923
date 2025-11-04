import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { blockers as blockersApi } from "../../api/client";
import { Button, Input, Select, Modal, Badge, Toast } from "../../components/ui";

/**
 * BlockersList: lists blockers with filters for status/priority/owner,
 * pagination, loading/error states, and delete flow.
 */

// PUBLIC_INTERFACE
export default function BlockersList() {
  /** Blockers listing page wired to unified API client */
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const ownerId = searchParams.get("ownerId") || "";

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      status: status || undefined,
      priority: priority || undefined,
      ownerId: ownerId || undefined,
    }),
    [page, pageSize, status, priority, ownerId]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await blockersApi.listBlockers(filters);
        const arr = Array.isArray(data) ? data : data?.items || [];
        if (active) setItems(arr);
      } catch (e) {
        if (active) setError(e?.message || "Failed to load blockers");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filters]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  }

  async function handleDelete(id) {
    const prev = items;
    setItems((list) => list.filter((r) => r.id !== id));
    try {
      await blockersApi.deleteBlocker(id);
      setToast("Blocker deleted successfully.");
      setTimeout(() => setToast(""), 2000);
    } catch (e) {
      setItems(prev);
      setError(e?.message || "Delete failed");
    } finally {
      setConfirm({ open: false, id: null });
    }
  }

  function gotoPage(p) {
    updateParam("page", String(p));
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
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Blockers</h2>
          <Button onClick={() => navigate("/blockers/new")}>+ New Blocker</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Select label="Status" value={status} onChange={(e) => updateParam("status", e.target.value)}>
            <option value="">Any</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="closed">Closed</option>
          </Select>
          <Select label="Priority" value={priority} onChange={(e) => updateParam("priority", e.target.value)}>
            <option value="">Any</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input label="Owner ID" value={ownerId} onChange={(e) => updateParam("ownerId", e.target.value)} placeholder="Filter by ownerId" />
          <Select label="Page Size" value={String(pageSize)} onChange={(e) => updateParam("pageSize", e.target.value)}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </Select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}

        {!loading && items.length === 0 && <p>No blockers found.</p>}

        <div style={{ display: "grid", gap: 10 }}>
          {items.map((b) => (
            <div key={b.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    <Link to={`/blockers/${encodeURIComponent(b.id)}`} className="App-link">
                      {b.title || `Blocker ${b.id}`}
                    </Link>
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span>Status:</span>
                    <Badge color={badgeColorFor(b.status, { open: "error", in_progress: "secondary", closed: "primary" })}>
                      {b.status || "unknown"}
                    </Badge>
                    <span>• Priority:</span>
                    <Badge color={badgeColorFor(b.priority, { low: "secondary", medium: "primary", high: "error" })}>
                      {b.priority || "n/a"}
                    </Badge>
                    {b.owner_id && <span>• Owner: {b.owner_id}</span>}
                    <span>• Updated: {b.updated_at || b.created_at || "n/a"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button variant="secondary" onClick={() => navigate(`/blockers/${encodeURIComponent(b.id)}/edit`)}>Edit</Button>
                  <Button variant="danger" onClick={() => setConfirm({ open: true, id: b.id })}>Delete</Button>
                </div>
              </div>
              {b.description && (
                <div style={{ marginTop: 8, color: "var(--text-secondary)" }}>
                  {(b.description || "").slice(0, 180)}
                  {(b.description || "").length > 180 ? "…" : ""}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button variant="ghost" onClick={() => gotoPage(Math.max(1, page - 1))} disabled={page <= 1}>
            Previous
          </Button>
          <div style={{ alignSelf: "center", color: "var(--text-secondary)" }}>Page {page}</div>
          <Button variant="ghost" onClick={() => gotoPage(page + 1)}>Next</Button>
        </div>
      </div>

      <Modal
        title="Delete blocker?"
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirm({ open: false, id: null })}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(confirm.id)}>Delete</Button>
          </>
        }
      >
        This action cannot be undone.
      </Modal>

      {toast && <Toast onClose={() => setToast("")}>{toast}</Toast>}
    </div>
  );
}
