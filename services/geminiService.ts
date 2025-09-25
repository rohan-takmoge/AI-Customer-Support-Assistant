import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, TicketCategory, TicketPriority, Sentiment, CategoryInsight, ActionableInsight, CustomerProfile, PredictiveInsight, Alert, SubCategoryInsight } from '../types';

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SCHEMA DEFINITIONS ---

const TICKET_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        analyzedTickets: {
            type: Type.ARRAY,
            description: "An array of analyzed tickets.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "The original ticket ID." },
                    summary: { type: Type.STRING, description: "A concise, one-sentence summary of the ticket's content." },
                    category: { type: Type.STRING, enum: Object.values(TicketCategory), description: "The most relevant category for the ticket." },
                    priority: { type: Type.STRING, enum: Object.values(TicketPriority), description: "The priority level of the ticket." },
                    sentiment: { type: Type.STRING, enum: Object.values(Sentiment), description: "The customer's sentiment." },
                },
                required: ["id", "summary", "category", "priority", "sentiment"]
            }
        }
    },
    required: ["analyzedTickets"]
};

const CATEGORY_INSIGHTS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        keyMetrics: {
            type: Type.OBJECT,
            properties: {
                totalTickets: { type: Type.INTEGER },
                avgResolutionTime: { type: Type.STRING, description: "e.g., '26 hours'" },
                csat: { type: Type.STRING, description: "e.g., '85%'" },
            },
            required: ["totalTickets", "avgResolutionTime", "csat"]
        },
        sentimentAnalysis: {
            type: Type.OBJECT,
            properties: {
                positive: { type: Type.NUMBER, description: "Percentage of positive tickets" },
                neutral: { type: Type.NUMBER, description: "Percentage of neutral tickets" },
                negative: { type: Type.NUMBER, description: "Percentage of negative tickets" },
            },
            required: ["positive", "neutral", "negative"]
        },
        commonKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ["keyMetrics", "sentimentAnalysis", "commonKeywords"]
};

const SUB_CATEGORY_INSIGHTS_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            subCategoryName: { type: Type.STRING, description: "A specific sub-topic within the main category." },
            percentage: { type: Type.NUMBER, description: "The percentage of tickets related to this sub-category." },
            summary: { type: Type.STRING, description: "A brief summary of what this sub-category is about." }
        },
        required: ["subCategoryName", "percentage", "summary"]
    }
};

const PREDICTIVE_INSIGHTS_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            trend: { type: Type.STRING, description: "The title or topic of the identified trend." },
            prediction: { type: Type.STRING, description: "A prediction based on the trend." },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
        },
        required: ["trend", "prediction", "confidence"]
    }
};

const ALERTS_SCHEMA = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique ID for the alert." },
            title: { type: Type.STRING, description: "A short, descriptive title for the alert." },
            description: { type: Type.STRING, description: "A longer description of the issue." },
            severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "The severity of the alert." },
            timestamp: { type: Type.STRING, description: "An ISO 8601 timestamp for when the alert was generated." }
        },
        required: ["id", "title", "description", "severity", "timestamp"]
    }
};


// --- API FUNCTIONS ---

export async function analyzeTicketsBatch(tickets: Pick<Ticket, 'id' | 'content'>[]): Promise<any[]> {
    try {
        const ticketData = tickets.map(t => `ID: ${t.id}, Content: "${t.content}"`).join('\n');
        const prompt = `Analyze the following customer support tickets. For each one, provide its ID, a one-sentence summary, its category, priority, and the customer's sentiment.

Tickets:
${ticketData}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: TICKET_ANALYSIS_SCHEMA,
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.analyzedTickets || [];
    } catch (error) {
        console.error("Error analyzing tickets batch:", error);
        return [];
    }
}

export async function getCategoryInsights(tickets: Ticket[], category: TicketCategory): Promise<CategoryInsight | null> {
    try {
        const ticketSummaries = tickets.map(t => `[Sentiment: ${t.sentiment}, Priority: ${t.priority}] ${t.summary}`).join('\n');
        const prompt = `Analyze this set of ${tickets.length} tickets from the "${category}" category. Provide key metrics (total tickets, average resolution time, and customer satisfaction score as a percentage), a sentiment breakdown in percentages, and a list of the top 5 most common keywords.

Ticket Summaries:
${ticketSummaries}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: CATEGORY_INSIGHTS_SCHEMA,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as CategoryInsight;
    } catch (error) {
        console.error(`Error getting insights for category ${category}:`, error);
        return null;
    }
}

export async function getSubCategoryInsights(tickets: Ticket[], category: TicketCategory): Promise<SubCategoryInsight[]> {
    try {
        const ticketContents = tickets.map(t => t.content).slice(0, 20).join('\n---\n'); // Use a sample
        const prompt = `Based on these ${tickets.length} tickets from the "${category}" category, identify the top 3-5 specific sub-topics or recurring issues. For each sub-topic, provide a name, its percentage of the total, and a brief summary.

Ticket Contents:
${ticketContents}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: SUB_CATEGORY_INSIGHTS_SCHEMA,
            },
        });

        return JSON.parse(response.text) as SubCategoryInsight[];
    } catch (error) {
        console.error(`Error getting sub-category insights for ${category}:`, error);
        return [];
    }
}

export async function generateSuggestedReply(ticketContent: string): Promise<string> {
    try {
        const prompt = `You are a helpful and empathetic customer support agent. Based on the following customer ticket, write a professional and clear reply. Address the customer's issue directly and provide a next step.

Customer Ticket:
"${ticketContent}"

Your Reply:
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating suggested reply:", error);
        return "Sorry, I couldn't generate a reply at this moment. Please try again.";
    }
}

export async function getPredictiveInsights(tickets: Ticket[]): Promise<PredictiveInsight[]> {
    try {
        const summaries = tickets.slice(0, 50).map(t => `[${t.date}, ${t.category}] ${t.summary}`).join('\n');
        const prompt = `Analyze these recent ticket summaries to identify emerging trends. Provide 1-2 predictive insights. For each, describe the trend, make a specific prediction, and give a confidence score.

Recent Tickets:
${summaries}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: PREDICTIVE_INSIGHTS_SCHEMA,
            },
        });
        return JSON.parse(response.text) as PredictiveInsight[];
    } catch (error) {
        console.error("Error getting predictive insights:", error);
        return [];
    }
}

export async function generateAlerts(tickets: Ticket[]): Promise<Alert[]> {
    try {
        const urgentTickets = tickets
            .filter(t => t.priority === TicketPriority.URGENT || t.priority === TicketPriority.HIGH)
            .slice(0, 20)
            .map(t => `[${t.category}, ${t.sentiment}] ${t.content}`)
            .join('\n---\n');
        
        if (!urgentTickets) return [];

        const prompt = `Review these high-priority tickets. Identify any widespread, critical issues that require immediate attention. Generate 1-2 alerts if necessary. For each alert, provide a unique ID, title, description, severity (High, Medium, or Low), and a timestamp.

High-Priority Tickets:
${urgentTickets}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ALERTS_SCHEMA,
            },
        });

        return JSON.parse(response.text) as Alert[];
    } catch (error) {
        console.error("Error generating alerts:", error);
        return [];
    }
}
