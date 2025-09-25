import React from 'react';
import { PredictiveInsight } from '../types';
import { TrendingUpIcon } from './icons';

interface PredictiveInsightCardProps {
  insights: PredictiveInsight[];
}

const PredictiveInsightCard: React.FC<PredictiveInsightCardProps> = ({ insights }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 h-full">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Predictive Insights</h2>
      {insights.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-500">
          <p>Not enough data to generate predictions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex gap-4 p-3 rounded-lg bg-slate-800">
              <div className="flex-shrink-0">
                <TrendingUpIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">{insight.trend}</h3>
                <p className="text-sm text-slate-400">{insight.prediction}</p>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${insight.confidence * 100}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 text-right mt-1">{(insight.confidence * 100).toFixed(0)}% Confidence</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictiveInsightCard;
