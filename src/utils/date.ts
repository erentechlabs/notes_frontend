import { formatDistanceToNow, format, isAfter } from 'date-fns';

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateTime(date: string): string {
  return format(new Date(date), 'PPpp');
}

export function isExpired(expiresAt: string): boolean {
  return isAfter(new Date(), new Date(expiresAt));
}
