import { getAccessToken } from "../utils/auth";

const API_BASE_URL = "https://cloud-backend-main-uq72da.laravel.cloud/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const withAuth = async () => {
  const token = await getAccessToken();
  return {
    ...defaultHeaders,
    Authorization: `Bearer ${token}`,
  };
};

// Auth Services

/**
 * Register a new user with name, username, email, and password
 */
export const register = async (payload: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });
  return response.json();
};

/**
 * Login using username and password
 */
export const login = async (payload: {
  username: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });
  return response.json();
};

/**
 * Logout user
 */
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: await withAuth(),
  });
  return response.json();
};

/**
 * Get authenticated user
 */
export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: await withAuth(),
  });
  return response.json();
};

/**
 * Request forgot password email
 */
export const forgotPassword = async (payload: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });
  return response.json();
};

/**
 * Reset password
 */
export const resetPassword = async (payload: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });
  return response.json();
};
