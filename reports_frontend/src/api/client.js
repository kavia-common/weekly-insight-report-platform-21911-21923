 /**
 * Unified API Client for DigitalT3 Weekly Report Platform.
 *
 * Features:
 * - Base URL from env (REACT_APP_API_BASE_URL). Avoid hardcoding.
 * - JWT Bearer auth from configurable token accessor (defaults to localStorage).
 * - Consistent error normalization for 4xx/5xx.
 * - Query param support and flexible headers injection.
 * - Endpoint coverage: auth, user, reports, blockers, dashboard, ai, notifications, export.
 *
 * Environment:
 * - REACT_APP_API_BASE_URL: Base URL of backend (e.g., https://api.weeklyinsight.example.com/api/v1)
 * - REACT_APP_SITE_URL: Used for redirects (e.g., auth flows)
 * - Optional future multi-service separation:
 *    - REACT_APP_NOTIFICATIONS_API_BASE_URL
 *    - REACT_APP_AI_API_BASE_URL
 *    - REACT_APP_EXPORT_API_BASE_URL
 *
 * Note:
 * - Some services might be on different hosts. See TODOs where applicable.
 * - Do not store secrets in code. Use environment variables.
 */

import { isSupabaseConfigured } from "../lib/supabaseClient";
import * as reportsService from "../services/reports";
import * as blockersService from "../services/blockers";

// ---------------------- Internal utilities ----------------------

let authToken = null; // in-memory override; if null, falls back to localStorage
let extraHeaders = {}; // headers to inject globally (e.g., for Supabase)

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from environment or defaults to relative '/api'. */
  const url =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "/api";
  return url.replace(/\/*$/, "");
}

/**
 * Resolve service-specific base URL.
 * This allows us to split services later without changing call sites.
 */
function getServiceBaseUrl(service) {
  const main = getApiBaseUrl();

  // TODO: If services split, uncomment mappings and ensure .env has these keys.
  // Example mappings:
  const map = {
    notifications: process.env.REACT_APP_NOTIFICATIONS_API_BASE_URL || main,
    ai: process.env.REACT_APP_AI_API_BASE_URL || main,
    export: process.env.REACT_APP_EXPORT_API_BASE_URL || main,
    main,
  };
  return (map[service] || main).replace(/\/*$/, "");
}

/**
 * Build query string from parameters.
 */
function toQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((item) => usp.append(k, String(item)));
    } else if (typeof v === "object") {
      // flatten simple objects as JSON string
      usp.set(k, JSON.stringify(v));
    } else {
      usp.set(k, String(v));
    }
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

/**
 * Normalize error into consistent object for the app to consume.
 */
async function normalizeError(res) {
  let bodyText = "";
  let body = null;
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await res.json();
    } else {
      bodyText = await res.text();
    }
  } catch (e) {
    // ignore parse errors
  }

  const message =
    (body && (body.message || body.error || body.detail)) ||
    bodyText ||
    res.statusText ||
    "Request failed";

  return {
    ok: false,
    status: res.status,
    code: String(res.status),
    message,
    details: body || null,
  };
}

/**
 * Get the active token:
 * - in-memory override set via setAuthToken
 * - or from localStorage key 'access_token'
 */
function resolveToken() {
  if (authToken) return authToken;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("access_token");
    }
  } catch {
    // SSR/No localStorage
  }
  return null;
}

/**
 * Core HTTP method wrapper around fetch.
 */
// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Perform a request to the backend with sensible defaults.
   * - path may be absolute or relative to API base URL.
   * - options: { method, headers, body, service, query, raw }
   * - raw: if true, returns the Response object (used for file downloads)
   */
  const {
    service = "main",
    query,
    raw = false,
    headers: headersInput,
    ...rest
  } = options;

  const base = getServiceBaseUrl(service);
  const fullPath = `${path.startsWith("/") ? path : `/${path}`}${
    query ? toQuery(query) : ""
  }`;
  const url = `${base}${fullPath}`;

  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
    ...(headersInput || {}),
  };

  const token = resolveToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const fetchOptions = {
    method: "GET",
    ...rest,
    headers,
  };

  // If body is an object and content-type is json, stringify it.
  if (
    fetchOptions.body &&
    typeof fetchOptions.body === "object" &&
    !(fetchOptions.body instanceof FormData) &&
    headers["Content-Type"] &&
    headers["Content-Type"].includes("application/json")
  ) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  let res;
  try {
    res = await fetch(url, fetchOptions);
  } catch (networkErr) {
    const err = {
      ok: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: networkErr?.message || "Network error",
      details: null,
    };
    throw err;
  }

  if (raw) {
    if (!res.ok) {
      throw await normalizeError(res);
    }
    return res;
  }

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    throw await normalizeError(res);
  }

  if (ct.includes("application/json")) {
    return res.json();
  }
  // fallback to text
  return res.text();
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /**
   * Set or clear the in-memory auth token.
   * If you also want to persist, do it at call site (e.g., localStorage.setItem('access_token', token)).
   */
  authToken = token || null;
}

// PUBLIC_INTERFACE
export function setExtraHeaders(headers = {}) {
  /**
   * Inject global headers (e.g., for Supabase: apikey, etc.)
   * These get merged into every request.
   */
  extraHeaders = { ...headers };
}

// PUBLIC_INTERFACE
export function getExtraHeaders() {
  /** Returns the currently configured extra headers map. */
  return { ...extraHeaders };
}

// ---------------------- API: Auth ----------------------

// PUBLIC_INTERFACE
export const auth = {
  /**
   * Register a new user.
   * body: { email, password, name }
   */
  async register({ email, password, name }) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: { email, password, name },
    });
  },

  /**
   * Login user and optionally set token via setAuthToken.
   * body: { email, password }
   * Returns: { token, user }
   */
  async login({ email, password }, { persist = true } = {}) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token) {
      if (persist) {
        try {
          localStorage.setItem("access_token", data.token);
        } catch {
          // ignore if unavailable
        }
      }
      setAuthToken(data.token);
    }
    return data;
  },
};

// ---------------------- API: User ----------------------

// PUBLIC_INTERFACE
export const user = {
  /** Get current authenticated user profile. */
  async getCurrentUser() {
    return apiRequest("/users/me", { method: "GET" });
  },

  /** Update profile fields e.g. { name } */
  async updateProfile(payload) {
    // Some specs use PUT/PATCH. Using PUT per primary spec in this workspace.
    return apiRequest("/users/me", { method: "PUT", body: payload });
  },
};

 
// ---------------------- API: Reports ----------------------

// PUBLIC_INTERFACE
export const reports = {
  /**
   * List reports with filters and pagination.
   * filters: { userId, status, limit/offset or page/pageSize, week, ... }
   */
  async listReports(filters = {}) {
    if (isSupabaseConfigured()) {
      return reportsService.listReports(filters);
    }
    // Supports either limit/offset (from one spec) or page/pageSize (from another).
    return apiRequest("/reports", { method: "GET", query: filters });
  },

  /** Create a new report. body should include { content, blockers? } or schema-compliant fields. */
  async createReport(body) {
    if (isSupabaseConfigured()) {
      return reportsService.createReport(body);
    }
    return apiRequest("/reports", { method: "POST", body });
  },

  /** Get a specific report by ID. */
  async getReport(id) {
    if (isSupabaseConfigured()) {
      return reportsService.getReportById(id);
    }
    return apiRequest(`/reports/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /** Update an existing report by ID. */
  async updateReport(id, body) {
    if (isSupabaseConfigured()) {
      return reportsService.updateReport(id, body);
    }
    // Some specs define PUT, others PATCH. We'll default to PUT for full update.
    return apiRequest(`/reports/${encodeURIComponent(id)}`, {
      method: "PUT",
      body,
    });
  },

  /** Delete report by ID. */
  async deleteReport(id) {
    if (isSupabaseConfigured()) {
      return reportsService.deleteReport(id);
    }
    return apiRequest(`/reports/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

 
// ---------------------- API: Blockers ----------------------

// PUBLIC_INTERFACE
export const blockers = {
  /** List blockers; supports filters like { status, reportId, limit/offset or page/pageSize }. */
  async listBlockers(filters = {}) {
    if (isSupabaseConfigured()) {
      return blockersService.listBlockers(filters);
    }
    return apiRequest("/blockers", { method: "GET", query: filters });
  },

  /** Get a specific blocker by ID. */
  async getBlocker(id) {
    if (isSupabaseConfigured()) {
      return blockersService.getBlockerById(id);
    }
    return apiRequest(`/blockers/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /** Create a blocker. */
  async createBlocker(body) {
    if (isSupabaseConfigured()) {
      return blockersService.createBlocker(body);
    }
    return apiRequest("/blockers", { method: "POST", body });
  },

  /** Update blocker by ID. */
  async updateBlocker(id, body) {
    if (isSupabaseConfigured()) {
      return blockersService.updateBlocker(id, body);
    }
    // Some specs may require PUT; use PUT for full update.
    return apiRequest(`/blockers/${encodeURIComponent(id)}`, {
      method: "PUT",
      body,
    });
  },

  /** Delete blocker by ID. */
  async deleteBlocker(id) {
    if (isSupabaseConfigured()) {
      return blockersService.deleteBlocker(id);
    }
    return apiRequest(`/blockers/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

// ---------------------- API: Dashboard ----------------------

// PUBLIC_INTERFACE
export const dashboard = {
  /**
   * Get dashboard data for current user or team.
   * filters can include { teamId }
   *
   * Note: Some specs use '/dashboards', others '/dashboard'. Try plural first, then singular.
   */
  async getDashboard(filters = {}) {
    try {
      return await apiRequest("/dashboards", { method: "GET", query: filters });
    } catch (err) {
      if (err?.status === 404) {
        // Fallback to singular route if service uses that.
        return apiRequest("/dashboard", { method: "GET", query: filters });
      }
      throw err;
    }
  },
};

// ---------------------- API: AI ----------------------

// PUBLIC_INTERFACE
export const ai = {
  /**
   * Get AI-generated summary by report ID.
   * Note: Some services could host AI endpoints separately.
   * TODO: If AI service has separate base URL, set service: 'ai' and define REACT_APP_AI_API_BASE_URL.
   */
  async getSummaryByReportId(reportId) {
    return apiRequest(`/ai/summary/${encodeURIComponent(reportId)}`, {
      method: "GET",
      service: "ai", // will fall back to main unless env is set in getServiceBaseUrl()
    });
  },
};

// ---------------------- API: Notifications ----------------------

// PUBLIC_INTERFACE
export const notifications = {
  /**
   * List notifications for the current user.
   * TODO: If notifications are hosted on separate service, define REACT_APP_NOTIFICATIONS_API_BASE_URL and map in getServiceBaseUrl().
   */
  async listNotifications(filters = {}) {
    return apiRequest("/notifications", {
      method: "GET",
      query: filters,
      service: "notifications",
    });
  },
};

// ---------------------- API: Export ----------------------

// PUBLIC_INTERFACE
export const exportsApi = {
  /**
   * Export reports as CSV or PDF.
   * Returns a Blob and filename to be handled at call-site.
   *
   * e.g. exportReports({ format: 'csv', week, userId })
   */
  async exportReports(params = {}) {
    const res = await apiRequest("/export/reports", {
      method: "GET",
      query: params,
      raw: true, // we want the Response to extract blob/filename
      service: "export",
      headers: {
        // For exporting files, avoid forcing JSON content-type on GET.
        "Content-Type": undefined,
      },
    });

    const blob = await res.blob();
    // Attempt to get filename from Content-Disposition
    const cd = res.headers.get("content-disposition") || "";
    let filename = "reports_export";
    const match = cd.match(/filename="?([^"]+)"?/i);
    if (match && match[1]) {
      filename = match[1];
    } else if (params?.format) {
      filename = `reports_export.${params.format}`;
    }

    return {
      blob,
      filename,
      contentType: res.headers.get("content-type") || "application/octet-stream",
    };
  },
};

// ---------------------- Default export ----------------------

// PUBLIC_INTERFACE
const api = {
  getApiBaseUrl,
  apiRequest,
  setAuthToken,
  setExtraHeaders,
  getExtraHeaders,
  auth,
  user,
  reports,
  blockers,
  dashboard,
  ai,
  notifications,
  exports: exportsApi,
};

export default api;
