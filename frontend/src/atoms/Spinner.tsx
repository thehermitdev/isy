import { cn } from '@/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-solid animate-spin',
        sizeMap[size],
        className
      )}
      style={{
        borderColor: 'oklch(0.58 0.25 280 / 0.20)',
        borderTopColor: 'oklch(0.58 0.25 280)',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 space-y-3">
      <SkeletonLine className="w-3/4 h-5" />
      <SkeletonLine className="w-1/2 h-4" />
      <SkeletonLine className="w-full h-4" />
    </div>
  );
}
