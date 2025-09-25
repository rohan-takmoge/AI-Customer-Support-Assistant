import React, { useState, useEffect } from 'react';
import { generateMockTickets } from './mockData';
import { Ticket, PredictiveInsight, Alert, TicketPriority, Sentiment, TicketStatus, priorityDetails } from './types';
import { getPredictiveInsights, generateAlerts, analyzeTicketsBatch } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import AlertsPanel from './components/AlertsPanel';
import PredictiveInsightCard from './components/PredictiveInsightCard';

const MOCK_TICKETS = generateMockTickets(50);
const EXAMPLE_TICKET_BATCH = MOCK_TICKETS.slice(0, 3).map(t => t.content).join('\n---\n');

const DashboardPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [batchText, setBatchText] = useState(EXAMPLE_TICKET_BATCH);
    const [analyzedTickets, setAnalyzedTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            const [preds, alertsData] = await Promise.all([
                getPredictiveInsights(MOCK_TICKETS),
                generateAlerts(MOCK_TICKETS)
            ]);
            setPredictiveInsights(preds);
            setAlerts(alertsData);
            setIsLoading(false);
        };
        fetchDashboardData();
    }, []);

    const handleAnalyzeBatch = async () => {
        if (!batchText.trim()) return;
        setIsAnalyzing(true);
        setAnalyzedTickets([]);

        const ticketContents = batchText.split('\n---\n').map((content, index) => ({
            id: `ticket-${Date.now()}-${index}`,
            content: content.trim()
        }));

        const results = await analyzeTicketsBatch(ticketContents);
        setAnalyzedTickets(results);
        setIsAnalyzing(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-100">Global Support Overview</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <AlertsPanel alerts={alerts} />
                </div>
                <div className="lg:col-span-2">
                    <PredictiveInsightCard insights={predictiveInsights} />
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-4">Batch Ticket Analysis</h2>
                <p className="text-sm text-slate-400 mb-4">Paste multiple tickets separated by "---" to analyze them all at once.</p>
                
                <textarea
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-sm focus:ring-sky-500 focus:border-sky-500 transition"
                    placeholder="Ticket 1 content...&#10;---&#10;Ticket 2 content..."
                />

                <div className="mt-4 text-right">
                    <button
                        onClick={handleAnalyzeBatch}
                        disabled={isAnalyzing}
                        className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Batch'}
                    </button>
                </div>
                
                {isAnalyzing && <LoadingSpinner />}

                {analyzedTickets.length > 0 && (
                     <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                          <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Summary</th>
                                    <th scope="col" className="px-4 py-3">Category</th>
                                    <th scope="col" className="px-4 py-3">Priority</th>
                                    <th scope="col" className="px-4 py-3">Sentiment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyzedTickets.map((ticket, index) => (
                                    <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/50">
                                        <td className="px-4 py-3">{ticket.summary}</td>
                                        <td className="px-4 py-3">{ticket.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${priorityDetails[ticket.priority as TicketPriority]?.color || 'bg-gray-500'} text-white`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{ticket.sentiment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
