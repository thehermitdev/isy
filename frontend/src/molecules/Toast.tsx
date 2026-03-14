import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple global toast store
let listeners: Array<() => void> = [];
let toasts: Toast[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const toast = {
  success: (message: string) => {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type: 'success' }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  error: (message: string) => {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type: 'error' }];
    notify();
    setTimeout(() => toast.dismiss(id), 5000);
  },
  warning: (message: string) => {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type: 'warning' }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  info: (message: string) => {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type: 'info' }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

const typeConfig: Record<ToastType, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />,
    className: 'border-emerald-500/30 bg-emerald-500/10',
  },
  error: {
    icon: <XCircle className="w-4 h-4 shrink-0 text-rose-400" />,
    className: 'border-rose-500/30 bg-rose-500/10',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />,
    className: 'border-amber-500/30 bg-amber-500/10',
  },
  info: {
    icon: <Info className="w-4 h-4 shrink-0 text-blue-400" />,
    className: 'border-blue-500/30 bg-blue-500/10',
  },
};

export function Toaster() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const update = () => setLocalToasts([...toasts]);
    listeners.push(update);
    return () => {
      listeners = listeners.filter((l) => l !== update);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {localToasts.map((t) => {
        const { icon, className } = typeConfig[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'glass flex items-center gap-3 px-4 py-3 pointer-events-auto animate-slide-right',
              className
            )}
            role="alert"
          >
            {icon}
            <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
              {t.message}
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="opacity-60 hover:opacity-100 transition-opacity ml-auto"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
