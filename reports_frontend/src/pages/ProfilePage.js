import React, { useEffect, useState } from "react";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

/**
 * ProfilePage displays current user info and allows updating the name.
 * - Protected by PrivateRoute
 * - Uses user.getCurrentUser and user.updateProfile via AuthContext
 */

// PUBLIC_INTERFACE
export default function ProfilePage() {
  /** User profile page with inline name update */
  const { user, refreshUser, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Ensure we have the latest profile on mount
    (async () => {
      try {
        const me = await refreshUser();
        if (me?.name) setName(me.name);
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!name || name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }
    setSaving(true);
    const res = await updateProfile({ name: name.trim() });
    setSaving(false);
    if (res.ok) {
      setMessage("Profile updated successfully.");
    } else {
      setError(res?.error?.message || "Failed to update profile.");
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Your Profile</h2>
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
        {message && <p style={{ color: "var(--color-success)" }}>{message}</p>}

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>User ID</div>
            <div style={{ fontWeight: 600 }}>{user?.id || "—"}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>Email</div>
            <div style={{ fontWeight: 600 }}>{user?.email || "—"}</div>
          </div>
        </div>

        <form onSubmit={onSave} style={{ marginTop: 16 }}>
          <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
