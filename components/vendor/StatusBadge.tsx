import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'error' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getVariant = (): BadgeVariant => {
    if (variant) return variant;
    
    // Auto-detect variant based on status text
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('confirm') || lowerStatus.includes('active')) return 'info';
    if (lowerStatus.includes('customer') || lowerStatus.includes('pending')) return 'warning';
    if (lowerStatus.includes('return') || lowerStatus.includes('complete') || lowerStatus.includes('publish')) return 'success';
    if (lowerStatus.includes('cancel') || lowerStatus.includes('unpublish')) return 'neutral';
    return 'info';
  };

  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-green-600 text-white',
    warning: 'bg-orange-600 text-white',
    info: 'bg-blue-600 text-white',
    error: 'bg-red-600 text-white',
    neutral: 'bg-gray-600 text-white',
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${variantClasses[getVariant()]}`}>
      {status}
    </span>
  );
}
