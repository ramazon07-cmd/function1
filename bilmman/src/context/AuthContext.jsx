import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearTokens, getAccessToken, saveTokens } from "../api/client";

const AuthContext = createContext(null);

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

      try {
        const profile = await api.profile();
        if (alive) setUser(profile);
      } catch {
        clearTokens();
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      alive = false;
    };
  }, []);

  async function login({ username, password }) {
    const tokens = await api.login({ username, password });
    saveTokens(tokens);
    const profile = await api.profile();
    setUser(profile);
    return profile;
  }

  async function register({ username, email, password }) {
    const data = await api.register({ username, email, password });
    saveTokens(data.tokens);
    const profile = await api.profile();
    setUser(profile);
    return profile;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
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
