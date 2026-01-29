import { create } from "zustand";
import type { User } from "../types/user";
import type { LoginResponse } from "../types/auth";
import { loginRequest } from "../api/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restore: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { user, token }: LoginResponse = await loginRequest(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      
        set({
        loading: false,
        error: message
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, loading: false });
  },

  restore: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        set({
          token,
          user: JSON.parse(user),
          loading: false
        });
        return;
      } catch {
        // If JSON parsing fails, treat as logged out
      }
    }

    // Always stop loading, even if no token or user
    set({ loading: false, user: null, token: null });
  }
}));