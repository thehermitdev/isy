import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '@/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change
  icon: React.ReactNode;
  color?: 'purple' | 'cyan' | 'green' | 'yellow' | 'red';
  prefix?: string;
  suffix?: string;
  className?: string;
  onClick?: () => void;
}

const colorMap = {
  purple: {
    glow: 'oklch(0.58 0.25 280)',
    icon: 'from-violet-500/20 to-purple-600/20',
    iconText: 'text-violet-400',
  },
  cyan: {
    glow: 'oklch(0.68 0.22 200)',
    icon: 'from-cyan-500/20 to-blue-600/20',
    iconText: 'text-cyan-400',
  },
  green: {
    glow: 'oklch(0.68 0.22 145)',
    icon: 'from-emerald-500/20 to-teal-600/20',
    iconText: 'text-emerald-400',
  },
  yellow: {
    glow: 'oklch(0.75 0.22 75)',
    icon: 'from-amber-500/20 to-orange-600/20',
    iconText: 'text-amber-400',
  },
  red: {
    glow: 'oklch(0.62 0.28 25)',
    icon: 'from-rose-500/20 to-red-600/20',
    iconText: 'text-rose-400',
  },
};

export function StatCard({
  title,
  value,
  change,
  icon,
  color = 'purple',
  prefix,
  suffix,
  className,
  onClick,
}: StatCardProps) {
  const colors = colorMap[color];
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  const formattedValue =
    typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div 
      className={cn('glass-card stat-card', onClick && 'cursor-pointer hover:border-white/20 transition-all active:scale-[0.98]', className)}
      onClick={onClick}
    >
      {/* Glow orb */}
      <div
        className="stat-card-glow"
        style={{ background: colors.glow }}
      />

      <div className="flex items-start justify-between gap-4 relative">
        {/* Icon */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl bg-linear-to-br flex items-center justify-center shrink-0',
            colors.icon
          )}
          style={{ border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <span className={cn('w-5 h-5', colors.iconText)}>{icon}</span>
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full',
              isPositive && 'text-emerald-400 bg-emerald-500/10',
              isNegative && 'text-rose-400 bg-rose-500/10',
              isNeutral && 'text-gray-400 bg-gray-500/10'
            )}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {isNeutral && <Minus className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="mt-4 relative">
        <p
          className="text-2xl font-bold number-transition"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          {prefix && <span className="text-lg mr-0.5" style={{ color: 'var(--text-secondary)' }}>{prefix}</span>}
          {formattedValue}
          {suffix && <span className="text-base ml-0.5" style={{ color: 'var(--text-secondary)' }}>{suffix}</span>}
        </p>
        <p className="text-xs mt-0.5 uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
      </div>
    </div>
  );
}
