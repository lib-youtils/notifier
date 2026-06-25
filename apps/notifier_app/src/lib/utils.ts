import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'less than a minute ago';
  if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  }
  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(diff / day);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
