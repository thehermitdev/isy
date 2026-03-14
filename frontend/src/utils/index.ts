import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type { LeadStatus, TicketStatus, TicketPriority, QuoteStatus } from '@/types';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a date string */
export function formatDate(date: string | Date | undefined, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—';
  try {
    return format(new Date(date), fmt);
  } catch {
    return '—';
  }
}

/** Format as relative time */
export function timeAgo(date: string | Date | undefined): string {
  if (!date) return '—';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '—';
  }
}

/** Format currency */
export function formatCurrency(amount: number | undefined, currency = 'USD'): string {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format large numbers */
export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Lead status display */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost',
};

export const LEAD_STATUS_BADGE: Record<LeadStatus, string> = {
  new: 'badge-cyan',
  contacted: 'badge-yellow',
  qualified: 'badge-purple',
  converted: 'badge-green',
  lost: 'badge-red',
};

/** Ticket status display */
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const TICKET_STATUS_BADGE: Record<TicketStatus, string> = {
  open: 'badge-cyan',
  in_progress: 'badge-yellow',
  resolved: 'badge-green',
  closed: 'badge-gray',
};

export const TICKET_PRIORITY_BADGE: Record<TicketPriority, string> = {
  low: 'badge-gray',
  medium: 'badge-yellow',
  high: 'badge-red',
  urgent: 'badge-red',
};

/** Quote status display */
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const QUOTE_STATUS_BADGE: Record<QuoteStatus, string> = {
  draft: 'badge-gray',
  sent: 'badge-cyan',
  accepted: 'badge-green',
  rejected: 'badge-red',
};

/** Debounce */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Truncate text */
export function truncate(text: string, length = 50): string {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
