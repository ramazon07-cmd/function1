import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, clearTokens, setTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    authApi
      .profile()
      .then((profile) => {
        if (alive) setUser(profile);
      })
      .catch(() => {
        clearTokens();
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  async function register({ name, email, password }) {
    const username = email.trim().toLowerCase();
    const data = await authApi.register({
      username,
      email: username,
      password,
      password2: password,
    });

    setTokens(data.tokens);
    const profile = await authApi.profile();
    setUser(profile);
    return profile;
  }

  async function login({ email, password }) {
    const data = await authApi.login({
      username: email.trim().toLowerCase(),
      password,
    });

    setTokens(data);
    const profile = await authApi.profile();
    setUser(profile);
    return profile;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak.");
  return value;
}
