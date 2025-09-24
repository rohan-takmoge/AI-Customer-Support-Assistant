
import React from 'react';
import { TicketCategory } from '../types';

interface TicketCategoryBadgeProps {
  category: TicketCategory;
}

const categoryColors: Record<TicketCategory, string> = {
  [TicketCategory.REFUND]: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  [TicketCategory.DELIVERY]: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
  [TicketCategory.COMPLAINT]: 'bg-red-400/10 text-red-300 border-red-400/20',
  [TicketCategory.GENERAL]: 'bg-green-400/10 text-green-300 border-green-400/20',
  [TicketCategory.UNKNOWN]: 'bg-gray-400/10 text-gray-300 border-gray-400/20',
};

export const TicketCategoryBadge: React.FC<TicketCategoryBadgeProps> = ({ category }) => {
  const colorClasses = categoryColors[category] || categoryColors[TicketCategory.UNKNOWN];
  
  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${colorClasses}`}>
      {category}
    </span>
  );
};
