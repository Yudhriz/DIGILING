import { create } from "zustand";
import {
  getStoredUser,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  User,
  UserRole,
} from "../utils/auth";
import * as authApi from "../services/authService";

type AuthError = string | Record<string, string[]>;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  isLoggedIn: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (payload: {
    email: string;
    otp: string;
    new_password: string;
    new_password_confirmation: string;
  }) => Promise<{ message: string }>;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  isLoading: false,
  error: null,
  isLoggedIn: isAuthenticated(),

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login({ username, password });
      setAuthTokens(response.token);
      set({
        user: response.user,
        isLoggedIn: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const apiErrors =
        error?.response?.data?.errors || error?.response?.data?.error || null;

      set({
        error: apiErrors || error.message || "Authentication failed",
        isLoading: false,
        isLoggedIn: false,
      });
    }
  },

  logout: () => {
    clearAuthTokens();
    set({ user: null, isLoggedIn: false });
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      await authApi.register(userData);
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Registration error:", error);

      let apiErrors: AuthError | null = null;
      let message = "Registration failed";

      if (error?.response?.data?.errors) {
        apiErrors = error.response.data.errors;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({
        error: apiErrors || message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.forgotPassword({ email });
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      console.error("Forgot password error:", error);

      const apiErrors =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        error.message ||
        "Failed to send OTP";

      set({
        error: apiErrors,
        isLoading: false,
      });

      throw error;
    }
  },

  resetPassword: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.resetPassword(payload);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      console.error("Password reset error:", error);

      const apiErrors =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        error.message ||
        "Password reset failed";

      set({
        error: apiErrors,
        isLoading: false,
      });

      throw error;
    }
  },

  updateUser: (userData) => {
    if (!get().user) return;

    const updatedUser = { ...get().user, ...userData } as User;
    set({ user: updatedUser });
    localStorage.setItem("digiling_user", JSON.stringify(updatedUser));
  },

  hasRole: (role) => {
    const { user } = get();
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  },
}));
