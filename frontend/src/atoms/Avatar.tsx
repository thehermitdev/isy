import { cn, getInitials } from '@/utils';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

// Generate a deterministic color from a string
function nameToColor(name: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-violet-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name = '?', src, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const gradient = nameToColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        `bg-linear-to-br ${gradient} rounded-full flex items-center justify-center font-semibold text-invert shrink-0`,
        sizeMap[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
