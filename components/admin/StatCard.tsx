import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };

  return (
    <div className="bg-black border border-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.positive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
