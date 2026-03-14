import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '@/organisms/Sidebar';
import { Toaster } from '@/molecules/Toast';
import { useAuthStore } from '@/store/authStore';

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
