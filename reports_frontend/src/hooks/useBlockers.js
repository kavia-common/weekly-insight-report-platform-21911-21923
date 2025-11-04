import { useEffect, useState } from "react";
import { blockers as blockersApi } from "../api/client";

/**
 * useBlockers hook fetches a list of blockers with optional filters and pagination.
 * filters: { status, reportId, page, pageSize }
 */

// PUBLIC_INTERFACE
export function useBlockers(initialFilters = {}) {
  /** Hook returning { items, loading, error, refetch, setFilters, filters } for blockers listing. */
  const [filters, setFilters] = useState({ page: 1, pageSize: 10, ...initialFilters });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(currentFilters) {
    setError("");
    setLoading(true);
    try {
      const data = await blockersApi.listBlockers(currentFilters);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.message || "Failed to load blockers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      await load(filters);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    refetch: () => load(filters),
  };
}
