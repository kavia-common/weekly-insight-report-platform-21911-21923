import React, { useEffect, useState } from "react";
import { Input, TextArea, Select, Button } from "../../components/ui";

/**
 * BlockerForm is a shared form for creating/editing blockers.
 * Fields:
 * - title (required)
 * - description (required)
 * - status (open/in_progress/closed)
 * - priority (low/medium/high)
 * - owner_id (text; optional)
 * - report_id (optional; hidden in UI for now but accepted in initial)
 */

// PUBLIC_INTERFACE
export default function BlockerForm({ initial = {}, onSubmit, submitting = false, mode = "create" }) {
  /** Shared Blocker form with minimal client-side validation */
  const [values, setValues] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    owner_id: "",
    report_id: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues((v) => ({
      ...v,
      title: initial.title || "",
      description: initial.description || "",
      status: initial.status || "open",
      priority: initial.priority || "medium",
      owner_id: initial.owner_id || initial.ownerId || "",
      report_id: initial.report_id || initial.reportId || "",
    }));
  }, [initial]);

  function validate() {
    const e = {};
    if (!values.title || values.title.trim().length < 3) e.title = "Please provide a title (min 3 chars).";
    if (!values.description || values.description.trim().length < 5)
      e.description = "Please provide a description (min 5 chars).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(k, v) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      owner_id: values.owner_id || undefined,
      report_id: values.report_id || undefined,
    };
    await onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={values.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="e.g., Access to production DB is blocked"
        error={errors.title}
        autoFocus
      />
      <TextArea
        label="Description"
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Provide details about the blocker and its impact..."
        error={errors.description}
        rows={6}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Select label="Status" value={values.status} onChange={(e) => handleChange("status", e.target.value)}>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="closed">Closed</option>
        </Select>
        <Select label="Priority" value={values.priority} onChange={(e) => handleChange("priority", e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Input
          label="Owner ID (optional)"
          value={values.owner_id}
          onChange={(e) => handleChange("owner_id", e.target.value)}
          placeholder="User ID responsible"
        />
      </div>
      {/* Future: expose report_id if needed
      <Input label="Report ID (optional)" value={values.report_id} onChange={(e)=>handleChange('report_id', e.target.value)} />
      */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Button type="submit" disabled={submitting}>
          {submitting ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create Blocker" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
