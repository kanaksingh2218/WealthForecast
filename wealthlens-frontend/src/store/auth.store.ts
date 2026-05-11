import { create } from 'zustand';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setAuth: (user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user: any) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
