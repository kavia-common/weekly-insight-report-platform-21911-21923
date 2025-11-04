import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, auth as authApi, user as userApi } from "../api/client";

/**
 * AuthContext provides authentication state, user profile, and helpers.
 * - Persists JWT token in localStorage under 'access_token'
 * - Wires token to API client via setAuthToken
 * - Exposes login, register, logout, refreshUser, and updateProfile
 */

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Current JWT token or null */
  token: null,
  /** Current user object or null */
  user: null,
  /** True while validating/restoring session or performing auth actions */
  initializing: false,
  /** Error message from last auth action */
  error: "",
  // PUBLIC_INTERFACE
  login: async (_creds) => {},
  // PUBLIC_INTERFACE
  register: async (_payload) => {},
  // PUBLIC_INTERFACE
  logout: () => {},
  // PUBLIC_INTERFACE
  refreshUser: async () => {},
  // PUBLIC_INTERFACE
  updateProfile: async (_payload) => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state and helpers for the app. */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // Restore token from localStorage and validate by fetching /users/me
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = localStorage.getItem("access_token");
        if (stored) {
          setAuthToken(stored);
          setToken(stored);
          try {
            const me = await userApi.getCurrentUser();
            if (active) setUser(me || null);
          } catch {
            // Token invalid -> clear
            localStorage.removeItem("access_token");
            setAuthToken(null);
            if (active) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        if (active) setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function login({ email, password }) {
    setError("");
    try {
      const data = await authApi.login({ email, password }, { persist: true });
      const t = data?.token || localStorage.getItem("access_token");
      if (t) {
        setAuthToken(t);
        setToken(t);
      }
      // Try fetching user profile after login
      try {
        const me = await userApi.getCurrentUser();
        setUser(me || null);
      } catch (e) {
        // Some backends include user in login response
        if (data?.user) setUser(data.user);
      }
      return { ok: true, data };
    } catch (e) {
      setError(e?.message || "Login failed");
      return { ok: false, error: e };
    }
  }

  async function register({ email, password, name }) {
    setError("");
    try {
      const registered = await authApi.register({ email, password, name });
      // Some APIs may not return token on register; attempt login immediately.
      // If registration returns token, persist via setAuthToken.
      if (registered?.token) {
        try {
          localStorage.setItem("access_token", registered.token);
        } catch {}
        setAuthToken(registered.token);
        setToken(registered.token);
      } else {
        await login({ email, password });
      }
      // Fetch user
      try {
        const me = await userApi.getCurrentUser();
        setUser(me || registered?.user || null);
      } catch {
        setUser(registered?.user || null);
      }
      return { ok: true, data: registered };
    } catch (e) {
      setError(e?.message || "Registration failed");
      return { ok: false, error: e };
    }
  }

  function logout() {
    try {
      localStorage.removeItem("access_token");
    } catch {}
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (!token) return null;
    try {
      const me = await userApi.getCurrentUser();
      setUser(me || null);
      return me;
    } catch (e) {
      // Invalid token
      logout();
      return null;
    }
  }

  async function updateProfile(payload) {
    try {
      const updated = await userApi.updateProfile(payload);
      setUser(updated || null);
      return { ok: true, data: updated };
    } catch (e) {
      setError(e?.message || "Update failed");
      return { ok: false, error: e };
    }
  }

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      error,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }),
    [token, user, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to read auth state and actions. */
  return useContext(AuthContext);
}
