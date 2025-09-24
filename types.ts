
export enum TicketCategory {
  REFUND = 'Refund Request',
  DELIVERY = 'Delivery Inquiry',
  COMPLAINT = 'Technical Complaint',
  GENERAL = 'General Question',
  UNKNOWN = 'Unknown',
}

export interface TicketAnalysis {
  category: TicketCategory;
  suggestedReply: string;
}
