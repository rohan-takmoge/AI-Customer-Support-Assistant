import React from 'react';
import { SubCategoryInsight } from '../types';
import { BarChart3Icon } from './icons';

interface SubCategoryBreakdownProps {
  insights: SubCategoryInsight[];
}

const SubCategoryBreakdown: React.FC<SubCategoryBreakdownProps> = ({ insights }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3Icon className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-100">Sub-Category Breakdown</h2>
      </div>
      {insights.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No specific sub-categories could be identified from the data.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {insights.map((insight, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-slate-200">{insight.subCategoryName}</h3>
                <span className="text-sm font-bold text-indigo-300">{insight.percentage.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{insight.summary}</p>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${insight.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryBreakdown;
