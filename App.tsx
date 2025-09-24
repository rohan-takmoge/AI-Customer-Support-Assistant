
import React, { useState } from 'react';
import { analyzeTicket } from './services/geminiService';
import { TicketAnalysis, TicketCategory } from './types';
import { TicketCategoryBadge } from './components/TicketCategoryBadge';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BrainCircuitIcon, WandSparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [ticketText, setTicketText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<TicketAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const exampleTickets = [
    {
      title: 'Refund Request',
      text: "Hi, I'd like to request a refund for my order #12345. The item arrived damaged and is not usable. I have attached photos. Please let me know the next steps. Thanks."
    },
    {
      title: 'Delivery Inquiry',
      text: "Hello, my tracking number ABC123XYZ shows that my package was delivered, but I haven't received it. Can you please check on the status for me?"
    },
    {
      title: 'Technical Complaint',
      text: "I'm having trouble logging into my account. Every time I enter my password, it says 'incorrect credentials', but I am sure it's correct. I've tried resetting it, but I never received the email."
    },
  ];

  const handleAnalyzeClick = async () => {
    if (!ticketText.trim()) {
      setError("Please enter a customer support ticket to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeTicket(ticketText);
      setAnalysisResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const useExample = (text: string) => {
    setTicketText(text);
    setAnalysisResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a small notification here if desired
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <BrainCircuitIcon className="w-12 h-12 text-sky-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
              Customer Support AI Assistant
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Automatically classify support tickets and generate smart replies to boost your team's efficiency.
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-6">
            <label htmlFor="ticket-input" className="block text-lg font-medium text-slate-300 mb-2">
              Paste Customer Ticket Here
            </label>
            <textarea
              id="ticket-input"
              value={ticketText}
              onChange={(e) => setTicketText(e.target.value)}
              placeholder="e.g., 'Hello, I haven't received my order yet, the tracking number is...'"
              className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 text-slate-200 placeholder-slate-500 resize-y"
              disabled={isLoading}
            />
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading || !ticketText.trim()}
              className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <WandSparklesIcon className="w-5 h-5 mr-2" />
                  Analyze Ticket
                </>
              )}
            </button>
          </div>

          {isLoading && <LoadingSpinner />}
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg text-center">{error}</div>}
          
          {analysisResult && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg animate-fade-in p-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-100">Analysis Results</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-2">Ticket Category</h3>
                  <TicketCategoryBadge category={analysisResult.category} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-2">Suggested Reply</h3>
                  <div className="relative">
                    <div className="p-4 bg-slate-900 border border-slate-600 rounded-md text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {analysisResult.suggestedReply}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(analysisResult.suggestedReply)}
                      className="absolute top-2 right-2 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8">
            <h3 className="text-xl font-semibold text-center text-slate-400 mb-6">Or try one of these examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exampleTickets.map((ex, index) => (
                <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-sky-600 transition-colors duration-300 flex flex-col">
                  <h4 className="font-bold text-slate-200 mb-2">{ex.title}</h4>
                  <p className="text-slate-400 text-sm flex-grow">"{ex.text.substring(0, 100)}..."</p>
                  <button
                    onClick={() => useExample(ex.text)}
                    className="mt-4 text-sm font-semibold text-sky-400 hover:text-sky-300 self-start"
                  >
                    Use this example &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;
