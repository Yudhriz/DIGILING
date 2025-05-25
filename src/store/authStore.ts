import { create } from "zustand";
import {
  getStoredUser,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  User,
  UserRole,
} from "../utils/auth";
import * as authApi from "../services/api"; // pastikan diimpor dengan benar

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  resetPassword: (payload: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ message: string }>;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  isLoading: false,
  error: null,
  isLoggedIn: isAuthenticated(),

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login({ username, password });
      setAuthTokens(response.token);

      set({
        user: response.user,
        isLoggedIn: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({
        error: error instanceof Error ? error.message : "Authentication failed",
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
    } catch (error) {
      console.error("Registration error:", error);
      set({
        error: error instanceof Error ? error.message : "Registration failed",
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
    } catch (error) {
      console.error("Password reset error:", error);
      set({
        error: error instanceof Error ? error.message : "Password reset failed",
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
