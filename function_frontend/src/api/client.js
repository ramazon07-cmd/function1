const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const ACCESS_KEY = "function_access_token";
const REFRESH_KEY = "function_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function saveTokens(tokens) {
  if (tokens?.access) localStorage.setItem(ACCESS_KEY, tokens.access);
  if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function parseResponse(response) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : "API xatolik yuz berdi");
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
}

export const api = {
  register: ({ username, email, password }) =>
    apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        password2: password,
      }),
    }),

  login: ({ username, password }) =>
    apiFetch("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  profile: () => apiFetch("/auth/profile/"),

  subjects: () => apiFetch("/subjects/"),

  tests: ({ subject = "", search = "", premium = "" } = {}) => {
    const params = new URLSearchParams();
    if (subject && subject !== "all") params.set("subject", subject);
    if (search) params.set("search", search);
    if (premium) params.set("premium", premium);
    const qs = params.toString();
    return apiFetch(`/tests/${qs ? `?${qs}` : ""}`);
  },

  testDetail: (id) => apiFetch(`/tests/${id}/`),

  submitTest: (id, answers) =>
    apiFetch(`/tests/${id}/submit/`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  attempts: () => apiFetch("/attempts/"),

  premiumMockPurchase: ({ test_id, subject_id, amount = 5000 }) =>
    apiFetch("/premium/mock-purchase/", {
      method: "POST",
      body: JSON.stringify({ test_id, subject_id, amount }),
    }),
};
