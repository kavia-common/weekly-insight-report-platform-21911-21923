/**
 * Simple API client using fetch. Centralizes base URL and auth token handling.
 * Uses environment variables. Do not hard-code secrets; set them in .env.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from environment or defaults to relative '/api'. */
  const url =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "/api";
  return url.replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /** Perform a JSON request to the backend with sensible defaults. */
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token =
    (window?.localStorage && localStorage.getItem("access_token")) || null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "GET",
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}
