import { getAccessToken } from "../utils/auth";

// API base URL (adjust if needed)
export const API_BASE_URL =
  "https://cloud-backend-main-uq72da.laravel.cloud/api";

// Default headers for public requests
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Generate headers with Authorization token.
 */
export const withAuth = (): HeadersInit => {
  const token = getAccessToken();

  return {
    ...defaultHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
