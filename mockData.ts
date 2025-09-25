import { Ticket, TicketCategory, TicketPriority, Sentiment, TicketStatus } from './types';

const sampleData = {
  names: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ian', 'Jane'],
  customerProfiles: [
    'New customer, first purchase',
    'Loyal customer, >10 purchases',
    'Tech-savvy user, enterprise account',
    'Beginner user, personal account',
    'Influencer, large social following',
    'Student, budget-conscious',
  ],
  [TicketCategory.ORDER_STATUS]: {
    subjects: ["Where is my order?", "Order tracking update", "Delivery delayed"],
    bodies: [
      "I placed an order #12345 a week ago and the tracking hasn't updated. Can you please check?",
      "My package was supposed to arrive yesterday but it's still not here. The tracking number is XYZ-987.",
      "Could you provide an ETA for my shipment? The order ID is ORD-555.",
    ]
  },
  [TicketCategory.PAYMENT_ISSUE]: {
    subjects: ["Payment failed", "Double charge on my card", "Coupon code not working", "Unrecognized charge"],
    bodies: [
      "I tried to place an order but my payment was declined, even though my card has sufficient funds. The error message was 'Payment Authorization Failed'.",
      "My credit card was charged twice for the same order #67890. Please refund the extra charge immediately. This is unacceptable.",
      "The 20% off coupon code 'SAVE20' isn't applying at checkout. It says it's invalid, but it should be active.",
      "I see a weird charge from your company on my bank statement that I don't recognize. The amount is $49.99. Can you explain what this is for?",
    ]
  },
  [TicketCategory.REFUND_RETURN]: {
    subjects: ["How to return an item?", "Refund status", "Received wrong item", "Damaged item received"],
    bodies: [
      "I'd like to return the product I received, it's not what I expected. What's the process? My order is #RET-001.",
      "I returned my order #ABC-111 two weeks ago but haven't received my refund yet. Can you check the status?",
      "You sent me the wrong color for the t-shirt I ordered. I want to exchange it for the correct one.",
      "I received a damaged item. The box was crushed and the product inside is broken. How can I get a replacement?",
    ]
  },
  [TicketCategory.TECHNICAL_BUG]: {
    subjects: ["Website not loading", "Can't log in", "App crashes on startup", "Feature not working"],
    bodies: [
      "Your website's checkout page is stuck on a loading spinner. I can't complete my purchase. I'm on Chrome version 110.",
      "I keep getting a 'password incorrect' error when I try to log in, but I'm sure it's correct. The password reset link you sent is also broken.",
      "The mobile app on my Android phone crashes every time I open it. I've already reinstalled it and cleared cache. My phone is a Pixel 7.",
      "The 'Export to CSV' feature on the dashboard is not working. When I click it, nothing happens. No file is downloaded.",
    ]
  },
  [TicketCategory.ACCOUNT_ISSUE]: {
    subjects: ["Locked out of my account", "Forgot my password", "Can't change my email"],
    bodies: [
      "My account seems to be locked for some reason. Can you please help me regain access?",
      "I forgot my password and the reset email is not coming through to my inbox.",
      "I'm trying to update my email address in my profile settings, but it gives me an error."
    ]
  },
  [TicketCategory.PRODUCT_INQUIRY]: {
    subjects: ["Question about product specs", "Is this compatible?", "Stock availability"],
    bodies: [
      "Does the new X-1 model have bluetooth 5.2? The website only mentions bluetooth.",
      "I have a Y-series laptop, will the Z-series docking station work with it?",
      "When will the red color of the smartwatch be back in stock? I'd like to be notified."
    ]
  },
  [TicketCategory.FEEDBACK_SUGGESTION]: {
    subjects: ["Feature request", "Suggestion for improvement", "Great experience!"],
    bodies: [
      "I love your product, but I wish it had a dark mode. It would be much easier on the eyes.",
      "You should consider adding a 'save for later' button on the product pages. I think many users would find it helpful.",
      "Just wanted to say your customer support is amazing. I had an issue and was resolved in minutes. Keep up the great work!",
    ]
  },
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(): Date {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90); // a date within the last 90 days
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockTickets(count: number): Ticket[] {
  const tickets: Ticket[] = [];
  const categories = Object.keys(sampleData).filter(k => Object.values(TicketCategory).includes(k as TicketCategory)) as TicketCategory[];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const categoryData = sampleData[category] || sampleData[TicketCategory.ORDER_STATUS];

    const ticket: Ticket = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: getRandomElement(sampleData.names),
      customerProfile: getRandomElement(sampleData.customerProfiles),
      date: getRandomDate().toISOString().split('T')[0],
      content: `${getRandomElement(categoryData.subjects)}. ${getRandomElement(categoryData.bodies)}`,
      // AI-enriched data will be filled later, but we can add defaults
      category: category,
      priority: getRandomElement(Object.values(TicketPriority)),
      sentiment: getRandomElement(Object.values(Sentiment)),
      status: getRandomElement(Object.values(TicketStatus)),
      summary: 'Summary to be generated by AI...',
      customerType: getRandomElement(['New', 'Returning', 'Premium']),
      resolvedBy: Math.random() > 0.3 ? 'Agent' : 'AI', // 30% resolved by AI
    };
    tickets.push(ticket);
  }
  return tickets;
}