import { Bell, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/atoms/Button';
import { useThemeStore } from '@/store/themeStore';
import type { ThemeMode } from '@/types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const THEMES: Array<{ mode: ThemeMode; icon: React.ReactNode; label: string }> = [
  { mode: 'light', icon: <Sun className="w-3.5 h-3.5" />, label: 'Light' },
  { mode: 'system', icon: <Monitor className="w-3.5 h-3.5" />, label: 'System' },
  { mode: 'dark', icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark' },
];

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { mode, setMode } = useThemeStore();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 shrink-0"
      style={{
        borderBottom: '1px solid var(--border-glass)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Title */}
      <div>
        <h1
          className="text-xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div
          className="flex items-center p-0.5 rounded-full"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
          }}
          role="group"
          aria-label="Theme selector"
        >
          {THEMES.map(({ mode: m, icon, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              title={label}
              aria-label={`Switch to ${label} theme`}
              aria-pressed={mode === m}
              className="flex items-center justify-center w-7 h-7 rounded-full transition-all"
              style={
                mode === m
                  ? {
                      background: 'linear-gradient(135deg, oklch(0.58 0.25 280 / 0.3), oklch(0.52 0.28 300 / 0.2))',
                      border: '1px solid oklch(0.58 0.25 280 / 0.35)',
                      color: 'oklch(0.82 0.15 280)',
                    }
                  : { color: 'var(--text-muted)', border: '1px solid transparent' }
              }
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'oklch(0.62 0.28 25)' }}
          />
        </Button>

        {/* Page-level actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
