// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getImageUrl(url: string): string {
  // If no URL provided, return placeholder
  if (!url) return '/images/placeholder.png';
  
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // If starts with /, assume it's a local path
  if (url.startsWith('/')) return url;
  
  // Otherwise, prepend API URL if available
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  // Fallback: treat as local path
  return `/${url}`;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Order statuses
    confirmed: 'bg-info/10 text-info',
    picked_up: 'bg-warning/10 text-warning',
    with_customer: 'bg-primary/10 text-primary',
    returned: 'bg-success/10 text-success',
    cancelled: 'bg-error/10 text-error',
    
    // Quotation statuses
    draft: 'bg-foreground-secondary/10 text-foreground-secondary',
    sent: 'bg-info/10 text-info',
    expired: 'bg-error/10 text-error',
    
    // Invoice statuses
    paid: 'bg-success/10 text-success',
    overdue: 'bg-error/10 text-error',
    
    // Payment statuses
    pending: 'bg-warning/10 text-warning',
    partial: 'bg-warning/10 text-warning',
    refunded: 'bg-info/10 text-info',
  };
  
  return statusColors[status] || 'bg-foreground-secondary/10 text-foreground-secondary';
}

export function calculateDuration(startDate: Date, endDate: Date, type: 'hourly' | 'daily' | 'weekly' | 'custom'): number {
  const diff = endDate.getTime() - startDate.getTime();
  
  switch (type) {
    case 'hourly':
      return Math.ceil(diff / (1000 * 60 * 60));
    case 'daily':
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    case 'weekly':
      return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    default:
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}