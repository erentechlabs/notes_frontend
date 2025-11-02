import { formatDistanceToNow, format, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Parse date string ensuring UTC interpretation
// If the timestamp lacks timezone info, append 'Z' to treat it as UTC
function parseUTCDate(dateString: string): Date {
  // If the string doesn't end with 'Z' or have a timezone offset, assume it's UTC
  if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
    return new Date(dateString + 'Z');
  }
  return new Date(dateString);
}

// All dates are displayed in the user's local timezone (client-side) with English formatting
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(parseUTCDate(date), { addSuffix: true, locale: enUS });
}

export function formatDateTime(date: string): string {
  return format(parseUTCDate(date), 'PPpp', { locale: enUS });
}

export function isExpired(expiresAt: string): boolean {
  return isAfter(new Date(), parseUTCDate(expiresAt));
}
