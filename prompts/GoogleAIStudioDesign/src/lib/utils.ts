import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate an ID since we're using mock data
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
