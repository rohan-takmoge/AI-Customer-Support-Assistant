import React from 'react';

interface ChartCardProps {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6 text-indigo-400" />}
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ChartCard;