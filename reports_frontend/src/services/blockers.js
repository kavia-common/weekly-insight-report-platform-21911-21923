/**
 * Blockers service: Supabase-backed CRUD for 'blockers' table.
 * Minimal assumed columns:
 *  - id
 *  - description (text)
 *  - status (text: open/closed/…)
 *  - report_id (foreign key to reports)
 *
 * Adjust getTableName('blockers') or shape below if schema differs.
 */

// PUBLIC_INTERFACE
/**
 * Blockers CRUD service based on Supabase client.
 */
import { supabase, isSupabaseConfigured, getTableName } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export async function listBlockers(filters = {}) {
  /** List blockers with optional filters: { status, reportId, page, pageSize } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  let query = supabase.from(table).select("*").order("updated_at", { ascending: false }).order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.reportId) query = query.eq("report_id", filters.reportId);

  if (filters.page || filters.pageSize) {
    const page = Number(filters.page || 1);
    const pageSize = Number(filters.pageSize || 10);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || "Failed to list blockers");
  return data || [];
}

// PUBLIC_INTERFACE
export async function createBlocker(payload) {
  /** Create blocker with fields: { description, status, report_id } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  const toInsert = {
    description: payload.description,
    status: payload.status || "open",
    report_id: payload.report_id || payload.reportId || null,
  };
  const { data, error } = await supabase.from(table).insert(toInsert).select("*").single();
  if (error) throw new Error(error.message || "Failed to create blocker");
  return data;
}

// PUBLIC_INTERFACE
export async function updateBlocker(id, payload) {
  /** Update blocker by id. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  const toUpdate = {
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(payload.report_id !== undefined || payload.reportId !== undefined
      ? { report_id: payload.report_id ?? payload.reportId }
      : {}),
  };
  const { data, error } = await supabase.from(table).update(toUpdate).eq("id", id).select("*").single();
  if (error) throw new Error(error.message || "Failed to update blocker");
  return data;
}

// PUBLIC_INTERFACE
export async function deleteBlocker(id) {
  /** Delete blocker by id. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message || "Failed to delete blocker");
  return { ok: true };
}
