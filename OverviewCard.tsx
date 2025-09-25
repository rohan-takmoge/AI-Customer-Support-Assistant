import React from 'react';
import { ArrowUpRightIcon, ArrowDownRightIcon } from './components/icons';

interface OverviewCardProps {
  title: string;
  value: number;
  change: number;
  unit?: string;
  invertChangeColor?: boolean;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, change, unit = '', invertChangeColor = false }) => {
  const isPositive = change >= 0;
  const changeColor = 
    (isPositive && !invertChangeColor) || (!isPositive && invertChangeColor)
    ? 'text-green-400'
    : 'text-red-400';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-5 animate-slide-in-up">
      <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span 
            className="text-3xl font-bold text-slate-50" 
            style={{'--num': value} as React.CSSProperties}
        >
            {value.toLocaleString()}
        </span>
        {unit && <span className="text-xl font-semibold text-slate-300">{unit}</span>}
      </div>
      <div className={`flex items-center text-sm font-semibold mt-2 ${changeColor}`}>
        {isPositive ? <ArrowUpRightIcon className="w-4 h-4" /> : <ArrowDownRightIcon className="w-4 h-4" />}
        <span>{Math.abs(change)}% vs last month</span>
      </div>
    </div>
  );
};

export default OverviewCard;
