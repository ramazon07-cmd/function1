import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, AUTH_EXPIRED_EVENT, clearTokens, getAccessToken, saveTokens } from "../api/client";

const AuthContext = createContext(null);
const PROFILE_ATTEMPTS = 3;
const PROFILE_RETRY_DELAY_MS = 1500;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }

      // A cold-starting or briefly unreachable API must not log the user out:
      // only a rejected token (401/403) clears the session; other errors are retried.
      for (let attempt = 0; attempt < PROFILE_ATTEMPTS && alive; attempt += 1) {
        try {
          const profile = await api.profile();
          if (alive) setUser(profile);
          break;
        } catch (err) {
          if (err.status === 401 || err.status === 403) {
            clearTokens();
            break;
          }
          if (attempt < PROFILE_ATTEMPTS - 1) {
            await new Promise((resolve) => setTimeout(resolve, PROFILE_RETRY_DELAY_MS));
          }
        }
      }
      if (alive) setLoading(false);
    }

    loadProfile();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  async function login({ email, password }) {
    const tokens = await api.login({ email, password });
    saveTokens(tokens);
    const profile = await api.profile();
    setUser(profile);
    return profile;
  }

  async function register({ name, email, password }) {
    const data = await api.register({ name, email, password });
    saveTokens(data.tokens);
    const profile = await api.profile();
    setUser(profile);
    return profile;
  }

  async function refreshProfile() {
    const profile = await api.profile();
    setUser(profile);
    return profile;
  }

  async function updateProfile(payload) {
    const profile = await api.updateProfile(payload);
    setUser(profile);
    return profile;
  }

  async function changePassword(payload) {
    return api.changePassword(payload);
  }

  async function deleteAccount() {
    await api.deleteAccount();
    clearTokens();
    setUser(null);
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      // While the saved session is being verified, a stored token counts as signed in,
      // so early clicks don't bounce to the sign-in page.
      isAuthenticated: Boolean(user) || (loading && Boolean(getAccessToken())),
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
