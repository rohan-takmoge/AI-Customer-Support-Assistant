import React from 'react';

export enum TicketCategory {
  // Order & Payment
  ORDER_STATUS = 'Order Status',
  PAYMENT_ISSUE = 'Payment Issue',
  REFUND_RETURN = 'Refund/Return',
  INVOICE_BILLING = 'Invoice & Billing',
  ORDER_CANCELLATION = 'Order Cancellation',
  
  // Technical Support
  ACCOUNT_ISSUE = 'Account Issue',
  TECHNICAL_BUG = 'Technical Bug',
  SETUP_HELP = 'Setup Help',
  API_INTEGRATION = 'API Integration',
  
  // Product Inquiry
  PRODUCT_INQUIRY = 'Product Inquiry',
  WARRANTY_GUARANTEE = 'Warranty & Guarantee',
  
  // Policy & Compliance
  RETURN_POLICY = 'Return Policy',
  PRIVACY_DATA = 'Privacy & Data',

  // Customer Experience
  FEEDBACK_SUGGESTION = 'Feedback/Suggestion',
  COMPLAINT_ESCALATION = 'Complaint/Escalation',
  LOYALTY_OFFERS = 'Loyalty & Offers',

  // Other
  SUBSCRIPTION_QUERY = 'Subscription Query',
  GENERAL_QUESTION = 'General Question',
  
  UNKNOWN = 'Unknown',
}


export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum Sentiment {
  POSITIVE = 'Positive',
  NEUTRAL = 'Neutral',
  NEGATIVE = 'Negative',
}

export enum TicketStatus {
  OPEN = 'Open',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export interface Ticket {
  id: string;
  customerName: string;
  customerProfile: string;
  customerType: 'New' | 'Returning' | 'Premium'; // New field for better analytics
  date: string;
  content: string;
  // AI-enriched data
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: Sentiment;
  status: TicketStatus;
  summary: string;
  resolvedBy: 'AI' | 'Agent'; // New field to track resolution source
}

export interface CategoryGroup {
  name: string;
  categories: {
    name: TicketCategory;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }[];
}

export const priorityDetails: Record<TicketPriority, { color: string }> = {
  [TicketPriority.URGENT]: { color: 'bg-red-600' },
  [TicketPriority.HIGH]: { color: 'bg-orange-500' },
  [TicketPriority.MEDIUM]: { color: 'bg-yellow-500' },
  [TicketPriority.LOW]: { color: 'bg-sky-500' },
};

export interface CategoryInsight {
    keyMetrics: {
        totalTickets: number;
        avgResolutionTime: string;
        csat: string;
    },
    sentimentAnalysis: {
        positive: number;
        neutral: number;
        negative: number;
    },
    commonKeywords: string[];
}

export interface ActionableInsight {
  title: string;
  description: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface CustomerProfile {
  persona: string;
  keyFrustrations: string[];
  suggestedApproach: string;
}

export interface PredictiveInsight {
    trend: string;
    prediction: string;
    confidence: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface SubCategoryInsight {
  subCategoryName: string;
  percentage: number;
  summary: string;
}