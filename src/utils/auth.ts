// utils/auth.ts

import { jwtDecode } from "jwt-decode";

// Storage keys
const ACCESS_TOKEN_KEY = "digiling_access_token";
const USER_DATA_KEY = "digiling_user";

// Role types
export type UserRole = "admin" | "guru_bk" | "siswa";

// User structure
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// JWT payload structure
interface JwtPayload {
  sub: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  exp: number;
}

/**
 * Set authentication token and store decoded user data.
 */
export const setAuthTokens = (accessToken: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const user: User = {
      id: decoded.sub,
      name: decoded.name,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to decode JWT:", error);
  }
};

/**
 * Clear authentication token and user data.
 */
export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Get stored access token.
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get stored user data.
 */
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error("Failed to parse stored user data:", error);
    return null;
  }
};

/**
 * Check if JWT is valid (not expired).
 */
export const isTokenValid = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    console.warn("Invalid token:", error);
    return false;
  }
};

/**
 * Check if user is authenticated.
 */
export const isAuthenticated = (): boolean => {
  return isTokenValid() && !!getStoredUser();
};

/**
 * Check if user has specific role(s).
 */
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const user = getStoredUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};
