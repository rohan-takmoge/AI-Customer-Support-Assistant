import React from 'react';
import { ActionableInsight } from '../types';
import { LightbulbIcon } from './icons';

interface ActionableInsightsProps {
  insights: ActionableInsight[];
}

const urgencyStyles = {
    High: {
        iconColor: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
    },
    Medium: {
        iconColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
    },
    Low: {
        iconColor: 'text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500/20',
    },
};

const ActionableInsights: React.FC<ActionableInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <LightbulbIcon className="w-6 h-6 text-yellow-300" />
        <h2 className="text-xl font-bold text-slate-100">AI-Powered Actionable Insights</h2>
      </div>
      {insights.length === 0 ? (
         <div className="flex items-center justify-center h-48 text-slate-500">
            <p>No specific actions recommended at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {insights.map((insight, index) => {
                const styles = urgencyStyles[insight.urgency];
                return (
                    <div key={index} className={`p-4 rounded-lg border ${styles.bgColor} ${styles.borderColor}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-200">{insight.title}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles.bgColor} ${styles.iconColor} border ${styles.borderColor}`}>
                                {insight.urgency} Urgency
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{insight.description}</p>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

export default ActionableInsights;
