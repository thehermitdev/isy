import { cn } from '@/utils';

interface BadgeProps {
  variant?: 'purple' | 'cyan' | 'green' | 'yellow' | 'red' | 'gray';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantMap = {
  purple: 'badge-purple',
  cyan: 'badge-cyan',
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  gray: 'badge-gray',
};

const dotColorMap = {
  purple: 'bg-brand-400',
  cyan: 'bg-accent-400',
  green: 'bg-success-400',
  yellow: 'bg-warning-400',
  red: 'bg-danger-400',
  gray: 'bg-current opacity-60',
};

export function Badge({ variant = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span className={cn('badge', variantMap[variant], className)}>
      {dot && (
        <span
          className={cn('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0', dotColorMap[variant])}
        />
      )}
      {children}
    </span>
  );
}
