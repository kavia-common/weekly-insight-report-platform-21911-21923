import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { reports as reportsApi } from "../../api/client";
import { Button, Input, Select, Modal, Badge } from "../../components/ui";

/**
 * ReportsList: lists weekly reports with basic filters and pagination.
 * Features:
 * - Filters: status, userId (text), week
 * - Pagination: page, pageSize
 * - Loading and error states
 * - Optimistic delete with confirmation modal
 */

// PUBLIC_INTERFACE
export default function ReportsList() {
  /** Reports list UI with filters and pagination wired to API client. */
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const status = searchParams.get("status") || "";
  const userId = searchParams.get("userId") || "";
  const week = searchParams.get("week") || "";

  const filters = useMemo(
    () => ({ page, pageSize, status: status || undefined, userId: userId || undefined, week: week || undefined }),
    [page, pageSize, status, userId, week]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await reportsApi.listReports(filters);
        // API could return array or {items,total}. Handle simply as array for now.
        const arr = Array.isArray(data) ? data : (data?.items || []);
        if (active) setItems(arr);
      } catch (e) {
        if (active) setError(e?.message || "Failed to load reports");
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
    // Optimistic remove
    const prev = items;
    setItems((list) => list.filter((r) => r.id !== id));
    try {
      await reportsApi.deleteReport(id);
    } catch (e) {
      // revert on failure
      setItems(prev);
      setError(e?.message || "Delete failed");
    } finally {
      setConfirm({ open: false, id: null });
    }
  }

  function gotoPage(p) {
    updateParam("page", String(p));
  }

  function badgeColorFor(status) {
    if (!status) return "secondary";
    const s = String(status).toLowerCase();
    if (s === "draft") return "secondary";
    if (s === "submitted" || s === "approved") return "primary";
    if (s === "rejected") return "error";
    return "secondary";
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Weekly Reports</h2>
          <Button onClick={() => navigate("/reports/new")}>+ New Report</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Select value={status} onChange={(e) => updateParam("status", e.target.value)} label="Status">
            <option value="">Any</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Input label="User ID" value={userId} onChange={(e) => updateParam("userId", e.target.value)} placeholder="Filter by userId" />
          <Input label="Week" value={week} onChange={(e) => updateParam("week", e.target.value)} placeholder="YYYY-ww or date" />
          <Select label="Page Size" value={String(pageSize)} onChange={(e) => updateParam("pageSize", e.target.value)}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </Select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}

        {!loading && items.length === 0 && <p>No reports found.</p>}

        <div style={{ display: "grid", gap: 10 }}>
          {items.map((r) => (
            <div key={r.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    <Link to={`/reports/${encodeURIComponent(r.id)}`} className="App-link">
                      {r.week ? `Week ${r.week}` : `Report ${r.id}`}
                    </Link>
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>Status:</span>
                    <Badge color={badgeColorFor(r.status)}>{r.status || "unknown"}</Badge>
                    <span>• Updated: {r.updatedAt || r.createdAt || "n/a"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button variant="secondary" onClick={() => navigate(`/reports/${encodeURIComponent(r.id)}/edit`)}>Edit</Button>
                  <Button variant="danger" onClick={() => setConfirm({ open: true, id: r.id })}>Delete</Button>
                </div>
              </div>
              <div style={{ marginTop: 8, color: "var(--text-secondary)" }}>
                {(r.content || "").slice(0, 180)}{(r.content || "").length > 180 ? "…" : ""}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button variant="ghost" onClick={() => gotoPage(Math.max(1, page - 1))} disabled={page <= 1}>Previous</Button>
          <div style={{ alignSelf: "center", color: "var(--text-secondary)" }}>Page {page}</div>
          <Button variant="ghost" onClick={() => gotoPage(page + 1)}>Next</Button>
        </div>
      </div>

      <Modal
        title="Delete report?"
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
    </div>
  );
}
