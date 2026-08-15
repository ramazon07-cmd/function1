const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const ACCESS_KEY = "function_access_token";
const REFRESH_KEY = "function_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens) {
  if (tokens?.access) localStorage.setItem(ACCESS_KEY, tokens.access);
  if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  setTokens({ access: data.access, refresh });
  return data.access;
}

export async function apiRequest(path, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiRequest(path, options, false);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      Object.values(data || {})?.flat?.()?.[0] ||
      "API xatolik berdi.";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register(payload) {
    return apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  profile() {
    return apiRequest("/auth/profile/");
  },
};

export const learningApi = {
  subjects() {
    return apiRequest("/subjects/");
  },
  courses(subjectSlug = "") {
    const query = subjectSlug ? `?subject=${subjectSlug}` : "";
    return apiRequest(`/courses/${query}`);
  },
  tests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tests/${query ? `?${query}` : ""}`);
  },
  testDetail(testId) {
    return apiRequest(`/tests/${testId}/`);
  },
  submitTest(testId, answers) {
    return apiRequest(`/tests/${testId}/submit/`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },
  attempts() {
    return apiRequest("/attempts/");
  },
  mockPurchase(payload) {
    return apiRequest("/premium/mock-purchase/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
