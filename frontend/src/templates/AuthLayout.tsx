import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/molecules/Toast';
import { useAuthStore } from '@/store/authStore';
import { Zap } from 'lucide-react';

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 relative">
      {/* Decorative orbs */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.58 0.25 280 / 0.12) 0%, transparent 70%)',
          top: '-200px',
          left: '-150px',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.68 0.22 200 / 0.10) 0%, transparent 70%)',
          bottom: '-100px',
          right: '-100px',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo above form */}
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.58 0.25 280), oklch(0.52 0.28 300))',
            boxShadow: '0 6px 20px oklch(0.58 0.25 280 / 0.40)',
          }}
        >
          <Zap className="w-5 h-5 text-invert" />
        </div>
        <div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            ISY CRM
          </span>
          <span className="block text-[10px] uppercase tracking-widest -mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Enterprise
          </span>
        </div>
      </div>

      <Outlet />

      <Toaster />
    </div>
  );
}
