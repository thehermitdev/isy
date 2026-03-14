import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './router';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,          // 30s before refetch
      gcTime: 5 * 60_000,         // 5 min cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  const { clearAuth } = useAuthStore();

  // Listen for global 401 events from Axios interceptor
  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener('isy:unauthorized', handler);
    return () => window.removeEventListener('isy:unauthorized', handler);
  }, [clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
