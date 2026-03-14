import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('isy_access_token', token);
        set({ user, accessToken: token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('isy_access_token');
        localStorage.removeItem('isy_user');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'isy-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
