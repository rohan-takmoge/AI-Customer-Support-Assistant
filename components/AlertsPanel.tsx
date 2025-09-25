import React from 'react';
import { Alert } from '../types';
import { AlertTriangleIcon } from './icons';

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityStyles = {
  High: {
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  Medium: {
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  Low: {
    iconColor: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
  },
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 h-full">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Proactive Alerts</h2>
      {alerts.length === 0 ? (
         <div className="flex items-center justify-center h-48 text-slate-500">
            <p>No critical alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const styles = severityStyles[alert.severity];
            return (
              <div key={alert.id} className={`flex gap-4 p-3 rounded-lg ${styles.bgColor}`}>
                <AlertTriangleIcon className={`w-6 h-6 flex-shrink-0 mt-1 ${styles.iconColor}`} />
                <div>
                  <h3 className="font-semibold text-slate-200">{alert.title}</h3>
                  <p className="text-sm text-slate-400">{alert.description}</p>
                   <p className="text-xs text-slate-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
