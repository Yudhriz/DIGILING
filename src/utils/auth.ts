import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "digiling_access_token";
const USER_DATA_KEY = "digiling_user";

export type UserRole = "admin" | "guru_bk" | "siswa";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface JwtPayload {
  sub: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  exp: number;
}

export const setAccessToken = (accessToken: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const setUserData = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error("[auth] Failed to parse stored user data:", error);
    return null;
  }
};

export const isTokenValid = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    console.warn("[auth] Invalid token:", error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  return isTokenValid() && !!getStoredUser();
};

export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const user = getStoredUser();
  if (!user) return false;
  return Array.isArray(role) ? role.includes(user.role) : user.role === role;
};
