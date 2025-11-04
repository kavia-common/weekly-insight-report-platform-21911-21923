import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reports as reportsApi } from "../../api/client";
import { Button, Modal } from "../../components/ui";

// PUBLIC_INTERFACE
export default function ReportDetail() {
  /** Shows a single report; allows delete with confirmation and navigate to edit. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const data = await reportsApi.getReport(id);
        if (active) setItem(data);
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

  async function handleDelete() {
    try {
      await reportsApi.deleteReport(id);
      navigate("/reports");
    } catch (e) {
      setError(e?.message || "Delete failed");
      setConfirm(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Report Details</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={() => navigate("/reports")}>Back</Button>
            <Button variant="secondary" onClick={() => navigate(`/reports/${encodeURIComponent(id)}/edit`)}>Edit</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Delete</Button>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {item && (
          <div>
            <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
              ID: {item.id} • Status: {item.status || "n/a"} • Week: {item.week || "n/a"}
            </div>
            <h3 style={{ marginBottom: 6 }}>Content</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{item.content}</p>

            {item.blockers && item.blockers.length > 0 && (
              <>
                <h3>Blockers</h3>
                <ul>
                  {item.blockers.map((b, idx) => (
                    <li key={idx}>{typeof b === "string" ? b : (b?.description || JSON.stringify(b))}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      <Modal
        title="Delete report?"
        open={confirm}
        onClose={() => setConfirm(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        This action will permanently delete this report.
      </Modal>
    </div>
  );
}
