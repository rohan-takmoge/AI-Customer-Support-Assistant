
import { GoogleGenAI, Type } from "@google/genai";
import { TicketAnalysis, TicketCategory } from '../types';

const TICKET_CATEGORIES = [
  TicketCategory.REFUND,
  TicketCategory.DELIVERY,
  TicketCategory.COMPLAINT,
  TicketCategory.GENERAL
];

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: `The classification of the ticket. Must be one of: ${TICKET_CATEGORIES.join(', ')}`,
      enum: TICKET_CATEGORIES,
    },
    suggestedReply: {
      type: Type.STRING,
      description: "A well-written, empathetic, and professional reply to the customer. Address the customer directly.",
    },
  },
  required: ["category", "suggestedReply"],
};


export const analyzeTicket = async (ticketText: string): Promise<TicketAnalysis> => {
  try {
    const prompt = `
      You are an expert customer support agent assistant. Analyze the following customer support ticket.
      First, classify it into one of the following categories: ${TICKET_CATEGORIES.join(', ')}.
      Second, write a professional, empathetic, and helpful draft reply to the customer.
      Provide your response in a JSON format that adheres to the provided schema.

      Customer Ticket:
      ---
      ${ticketText}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Validate the category from the response
    const category = TICKET_CATEGORIES.includes(parsedJson.category) 
      ? parsedJson.category 
      : TicketCategory.UNKNOWN;

    return {
      category: category,
      suggestedReply: parsedJson.suggestedReply || "No reply could be generated.",
    };

  } catch (error) {
    console.error("Error analyzing ticket with Gemini API:", error);
    if (error instanceof Error) {
       throw new Error(`Failed to analyze ticket: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing the ticket.");
  }
};
