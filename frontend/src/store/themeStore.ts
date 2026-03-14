import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setMode: (mode: ThemeMode) => void;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedTheme: getSystemTheme(),

      setMode: (mode) => {
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        applyTheme(resolved);
        set({ mode, resolvedTheme: resolved });
      },
    }),
    {
      name: 'isy-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = state.mode === 'system' ? getSystemTheme() : state.mode;
          applyTheme(resolved);
          state.resolvedTheme = resolved;
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { mode, setMode } = useThemeStore.getState();
    if (mode === 'system') {
      setMode('system');
    }
  });
}
