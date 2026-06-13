const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

type TokenPayload = { exp?: number };
let refreshPromise: Promise<string | null> | null = null;

const decodeTokenPayload = (token: string): TokenPayload | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => localStorage.getItem("authToken");

export const getTokenRefreshDelay = (token: string) => {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return 0;
  return Math.max(payload.exp * 1000 - Date.now() - REFRESH_BEFORE_EXPIRY_MS, 0);
};

export const isAccessTokenUsable = (token: string) => {
  const payload = decodeTokenPayload(token);
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now() + REFRESH_BEFORE_EXPIRY_MS);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.token) return null;
      localStorage.setItem("authToken", data.token);
      return data.token as string;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const getValidAccessToken = async () => {
  const token = getStoredAccessToken();
  if (token && isAccessTokenUsable(token)) return token;
  return refreshAccessToken();
};

export const clearStoredSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("userProfile");
};
