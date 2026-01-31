import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'purple' | 'blue' | 'green' | 'orange';
}

export default function StatCard({ title, value, icon, trend, color = 'purple' }: StatCardProps) {
  const colorClasses = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="bg-black border border-white rounded-lg p-6 hover:border-purple-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
