/**
 * Reports service: Supabase-backed CRUD for 'reports' table.
 * Columns assumed:
 *  - id (uuid or serial)
 *  - content (text)
 *  - status (text)
 *  - week (text)
 *  - blockers (json or text; we store array when possible)
 *  - created_at / updated_at managed by DB triggers (optional)
 *
 * If your schema differs, adjust the payload shaping in create/update and the select columns.
 */

// PUBLIC_INTERFACE
/**
 * Reports CRUD service based on Supabase client.
 */
import { supabase, isSupabaseConfigured, getTableName } from "../lib/supabaseClient";

// Helper to normalize blockers field to array or null
function toBlockersArray(blockers) {
  if (!blockers) return null;
  if (Array.isArray(blockers)) return blockers;
  if (typeof blockers === "string") {
    return blockers
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [String(blockers)];
}

// PUBLIC_INTERFACE
export async function listReports(filters = {}) {
  /** List reports with optional filters: { userId, status, week, page, pageSize } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("reports");
  let query = supabase.from(table).select("*").order("updated_at", { ascending: false }).order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.userId) query = query.eq("user_id", filters.userId);
  if (filters.week) query = query.eq("week", filters.week);

  // Pagination
  if (filters.page || filters.pageSize) {
    const page = Number(filters.page || 1);
    const pageSize = Number(filters.pageSize || 10);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || "Failed to list reports");
  return data || [];
}

// PUBLIC_INTERFACE
export async function createReport(payload) {
  /** Create a report with fields: { content, status, week, blockers } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("reports");
  const toInsert = {
    content: payload.content,
    status: payload.status || "draft",
    week: payload.week || null,
    blockers: payload.blockers ? toBlockersArray(payload.blockers) : null,
  };

  const { data, error } = await supabase.from(table).insert(toInsert).select("*").single();
  if (error) throw new Error(error.message || "Failed to create report");
  return data;
}

// PUBLIC_INTERFACE
export async function getReportById(id) {
  /** Fetch a single report by id. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("reports");
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) throw new Error(error.message || "Failed to load report");
  return data;
}

// PUBLIC_INTERFACE
export async function updateReport(id, payload) {
  /** Update report by id with provided fields. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("reports");
  const toUpdate = {
    ...(payload.content !== undefined ? { content: payload.content } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(payload.week !== undefined ? { week: payload.week } : {}),
    ...(payload.blockers !== undefined ? { blockers: toBlockersArray(payload.blockers) } : {}),
  };

  const { data, error } = await supabase.from(table).update(toUpdate).eq("id", id).select("*").single();
  if (error) throw new Error(error.message || "Failed to update report");
  return data;
}

// PUBLIC_INTERFACE
export async function deleteReport(id) {
  /** Delete report by id. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("reports");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message || "Failed to delete report");
  return { ok: true };
}
