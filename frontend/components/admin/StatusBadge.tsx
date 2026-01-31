import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  // Auto-detect variant based on status if not provided
  const getVariant = (): string => {
    if (variant) {
      const variantClasses = {
        success: 'bg-green-500/20 text-green-400 border-green-500',
        warning: 'bg-orange-500/20 text-orange-400 border-orange-500',
        error: 'bg-red-500/20 text-red-400 border-red-500',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500',
        neutral: 'bg-gray-500/20 text-gray-400 border-gray-500',
      };
      return variantClasses[variant];
    }

    // Auto-detect based on status text
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('published') || statusLower.includes('returned') || statusLower.includes('paid') || statusLower.includes('success')) {
      return 'bg-green-500/20 text-green-400 border-green-500';
    }
    if (statusLower.includes('pending') || statusLower.includes('with customer') || statusLower.includes('confirmed')) {
      return 'bg-orange-500/20 text-orange-400 border-orange-500';
    }
    if (statusLower.includes('inactive') || statusLower.includes('unpublished') || statusLower.includes('canceled') || statusLower.includes('failed')) {
      return 'bg-red-500/20 text-red-400 border-red-500';
    }
    if (statusLower.includes('suspended')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    }
    return 'bg-gray-500/20 text-gray-400 border-gray-500';
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getVariant()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
