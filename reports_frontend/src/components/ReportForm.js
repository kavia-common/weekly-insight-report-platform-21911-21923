import React, { useEffect, useState } from "react";
import { Input, TextArea, Select, Button } from "./ui";

/**
 * ReportForm is a shared form for creating and editing weekly reports.
 * Fields (kept minimal for this task):
 * - week (YYYY-Www or date; stored as string)
 * - status (draft/submitted)
 * - content (required)
 * - blockers (optional free-text for now)
 */

// PUBLIC_INTERFACE
export default function ReportForm({ initial = {}, onSubmit, submitting = false, mode = "create" }) {
  /** Shared form with basic client-side validation. Calls onSubmit(data) when valid. */
  const [values, setValues] = useState({
    week: "",
    status: "draft",
    content: "",
    blockers: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues((v) => ({
      ...v,
      week: initial.week || "",
      status: initial.status || "draft",
      content: initial.content || "",
      blockers: Array.isArray(initial.blockers) ? initial.blockers.join("\n") : (initial.blockers || ""),
    }));
  }, [initial]);

  function validate() {
    const e = {};
    if (!values.content || values.content.trim().length < 10) {
      e.content = "Please provide at least 10 characters.";
    }
    if (values.week && !/^\d{4}-\d{2}|\d{4}-W\d{2}$/i.test(values.week)) {
      // allow "YYYY-ww" or leave empty; keeping flexible
      // No hard stop, but show hint if format odd
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(k, v) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // Normalize blockers to array of lines if any
    const payload = {
      week: values.week || undefined,
      status: values.status,
      content: values.content.trim(),
      blockers: values.blockers
        ? values.blockers
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    };
    await onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input
          label="Week (optional)"
          placeholder="e.g., 2025-05 or 2025-W14"
          value={values.week}
          onChange={(e) => handleChange("week", e.target.value)}
        />
        <Select
          label="Status"
          value={values.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
        </Select>
      </div>

      <TextArea
        label="Report Content"
        placeholder="Summarize your progress, achievements, and plans..."
        value={values.content}
        onChange={(e) => handleChange("content", e.target.value)}
        error={errors.content}
        rows={10}
      />

      <TextArea
        label="Blockers (one per line, optional)"
        placeholder="List blockers affecting your work..."
        value={values.blockers}
        onChange={(e) => handleChange("blockers", e.target.value)}
        rows={5}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Button type="submit" disabled={submitting}>
          {submitting ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create Report" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
