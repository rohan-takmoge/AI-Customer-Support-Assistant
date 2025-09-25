import React from 'react';
import { CustomerProfile } from '../types';
import { UsersIcon } from './icons';

interface CustomerProfileCardProps {
  personas: CustomerProfile[];
}

const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ personas }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <UsersIcon className="w-6 h-6 text-sky-300" />
        <h2 className="text-xl font-bold text-slate-100">Key Customer Personas</h2>
      </div>
      {personas.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
            <p>No distinct customer personas identified from the data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, index) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-sky-400 text-lg mb-2">{persona.persona}</h3>
              <div>
                <h4 className="font-semibold text-slate-300 text-sm mb-1">Key Frustrations:</h4>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                  {persona.keyFrustrations.map((frustration, i) => (
                    <li key={i}>{frustration}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <h4 className="font-semibold text-slate-300 text-sm mb-1">Suggested Approach:</h4>
                <p className="text-sm text-slate-400">{persona.suggestedApproach}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerProfileCard;
