import React from 'react';


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorVariants = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  green: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  red: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend
}) => {
  return (
    <div
      className={`p-6 rounded-xl ${colorVariants[color]} 
                  transition-all duration-200 
                  hover:scale-105 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-200' : 'text-red-200'
              }`}
            >
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="ml-1 opacity-70">vs. mes anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-white/20">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
