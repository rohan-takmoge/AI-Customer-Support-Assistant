
import React from 'react';
import { TicketCategory } from '../types';

interface TicketCategoryBadgeProps {
  category: TicketCategory;
}

// FIX: Added all missing categories and corrected BILLING_INQUIRY to INVOICE_BILLING
// to ensure the component can render a badge for every possible ticket category.
const categoryColors: Record<TicketCategory, string> = {
  // Order & Payment
  [TicketCategory.ORDER_STATUS]: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
  [TicketCategory.PAYMENT_ISSUE]: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
  [TicketCategory.REFUND_RETURN]: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  [TicketCategory.INVOICE_BILLING]: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',

  // Technical Support
  [TicketCategory.ACCOUNT_ISSUE]: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  [TicketCategory.TECHNICAL_BUG]: 'bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20',
  [TicketCategory.SETUP_HELP]: 'bg-pink-400/10 text-pink-300 border-pink-400/20',
  [TicketCategory.API_INTEGRATION]: 'bg-violet-400/10 text-violet-300 border-violet-400/20',

  // Policy & Compliance
  [TicketCategory.WARRANTY_GUARANTEE]: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  [TicketCategory.RETURN_POLICY]: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  [TicketCategory.PRIVACY_DATA]: 'bg-slate-400/10 text-slate-300 border-slate-400/20',

  // Customer Experience
  [TicketCategory.FEEDBACK_SUGGESTION]: 'bg-lime-400/10 text-lime-300 border-lime-400/20',
  [TicketCategory.COMPLAINT_ESCALATION]: 'bg-red-400/10 text-red-300 border-red-400/20',
  [TicketCategory.LOYALTY_OFFERS]: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',

  // Legacy from analysis
  [TicketCategory.ORDER_CANCELLATION]: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
  [TicketCategory.PRODUCT_INQUIRY]: 'bg-teal-400/10 text-teal-300 border-teal-400/20',
  [TicketCategory.SUBSCRIPTION_QUERY]: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
  [TicketCategory.GENERAL_QUESTION]: 'bg-green-400/10 text-green-300 border-green-400/20',

  // Fallback
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
