import { API_BASE_URL, defaultHeaders, withAuth } from "./api";

interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password: string;
  new_password_confirmation: string;
}

// Handle JSON or plain text response
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (!contentType?.includes("application/json")) {
    console.error("Unexpected response:", text);
    throw new Error("Server did not return JSON");
  }

  const json = JSON.parse(text);
  if (!response.ok) {
    throw new Error(json.message || "Something went wrong");
  }

  return json;
};

// Register
export const register = async (payload: RegisterPayload) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Login
export const login = async (payload: LoginPayload) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Logout
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: withAuth(),
  });

  return handleResponse(response);
};

// Get current user
export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: withAuth(),
  });

  return handleResponse(response);
};

// Forgot password
export const forgotPassword = async (payload: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Reset password
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
