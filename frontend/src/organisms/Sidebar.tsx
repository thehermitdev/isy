import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Megaphone,
  Activity as ActivityIcon,
  Headphones,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/atoms/Avatar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { path: '/relationships', label: 'Relationships', icon: <Users className="w-4.5 h-4.5" /> },
  { path: '/opportunities', label: 'Opportunities', icon: <TrendingUp className="w-4.5 h-4.5" /> },
  { path: '/products', label: 'Products', icon: <Package className="w-4.5 h-4.5" /> },
  { path: '/quotes', label: 'Quotes', icon: <FileText className="w-4.5 h-4.5" /> },
  { path: '/campaigns', label: 'Campaigns', icon: <Megaphone className="w-4.5 h-4.5" /> },
  { path: '/support', label: 'Support', icon: <Headphones className="w-4.5 h-4.5" /> },
  { path: '/activities', label: 'Activities', icon: <ActivityIcon className="w-4.5 h-4.5" /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <aside
      className="glass-sidebar flex flex-col h-full transition-all duration-300 ease-in-out relative z-30"
      style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-glass)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, oklch(0.58 0.25 280), oklch(0.52 0.28 300))',
            boxShadow: '0 4px 12px oklch(0.58 0.25 280 / 0.40)',
          }}
        >
          <Zap className="w-4 h-4 text-invert" />
        </div>

        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <span
              className="text-base font-bold tracking-tight whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              ISY CRM
            </span>
            <span className="block text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Enterprise
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            id={`nav-${item.label.toLowerCase()}`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'text-invert'
                  : 'hover:bg-white/5',
                collapsed && 'justify-center'
              )
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, oklch(0.58 0.25 280 / 0.25), oklch(0.52 0.28 300 / 0.15))',
                    border: '1px solid oklch(0.58 0.25 280 / 0.35)',
                    boxShadow: '0 2px 12px oklch(0.58 0.25 280 / 0.15)',
                  }
                : { color: 'var(--text-secondary)', border: '1px solid transparent' }
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-violet-300' : 'group-hover:text-violet-400'
                  )}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="whitespace-nowrap animate-fade-in">{item.label}</span>
                )}
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: 'oklch(0.75 0.20 280)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — User info */}
      <div
        className="shrink-0 px-2 py-3"
        style={{ borderTop: '1px solid var(--border-glass)' }}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded-xl',
            collapsed && 'justify-center flex-col py-3'
          )}
        >
          <Avatar name={user?.name || user?.email || 'User'} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] truncate capitalize" style={{ color: 'var(--text-muted)' }}>
                {user?.role || 'member'}
              </p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg transition-colors opacity-60 hover:opacity-100 shrink-0"
            style={{ color: 'var(--text-secondary)' }}
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all"
        style={{
          background: 'var(--bg-sidebar)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)',
          backdropFilter: 'blur(12px)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
