/**
 * Blockers service: Supabase-backed CRUD for 'blockers' table.
 * Schema expectations (configurable; see assets/supabase.md):
 *  - id
 *  - title (text)
 *  - description (text)
 *  - status (text: open/closed/in_progress/…)
 *  - priority (text: low/medium/high/…)
 *  - owner_id (text or uuid, FK to users if available)
 *  - report_id (optional FK to reports)
 *  - created_at, updated_at (timestamps)
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
  /** List blockers with optional filters: { status, reportId, ownerId, priority, page, pageSize } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  let query = supabase
    .from(table)
    .select("*")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.reportId) query = query.eq("report_id", filters.reportId);
  if (filters.ownerId) query = query.eq("owner_id", filters.ownerId);
  if (filters.priority) query = query.eq("priority", filters.priority);

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
export async function getBlockerById(id) {
  /** Fetch a single blocker by id. */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) throw new Error(error.message || "Failed to load blocker");
  return data;
}

// PUBLIC_INTERFACE
export async function createBlocker(payload) {
  /** Create blocker with fields: { title, description, status, priority, owner_id, report_id } */
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const table = getTableName("blockers");
  const toInsert = {
    title: payload.title || null,
    description: payload.description || null,
    status: payload.status || "open",
    priority: payload.priority || "medium",
    owner_id: payload.owner_id ?? payload.ownerId ?? null,
    report_id: payload.report_id ?? payload.reportId ?? null,
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
    ...(payload.title !== undefined ? { title: payload.title } : {}),
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(payload.priority !== undefined ? { priority: payload.priority } : {}),
    ...(payload.owner_id !== undefined || payload.ownerId !== undefined
      ? { owner_id: payload.owner_id ?? payload.ownerId }
      : {}),
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
