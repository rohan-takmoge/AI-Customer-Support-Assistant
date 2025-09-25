import React, { useState, useEffect } from 'react';
import { TicketCategory, Ticket, CategoryInsight, SubCategoryInsight } from './types';
import { generateMockTickets } from './mockData';
import { getCategoryInsights, getSubCategoryInsights, generateSuggestedReply } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import OverviewCard from './OverviewCard';
import { DonutChart, LineChart, HorizontalBarChart } from './charts';
import TicketTable from './TicketTable';
import ChartCard from './components/ChartCard';
import { TrendingUpIcon, BarChart3Icon, PieChartIcon } from './components/icons';


const ALL_MOCK_TICKETS = generateMockTickets(200);

interface CategoryInsightsPageProps {
  category: TicketCategory;
  onNavigateBack: () => void;
}

const CategoryInsightsPage: React.FC<CategoryInsightsPageProps> = ({ category, onNavigateBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [insights, setInsights] = useState<CategoryInsight | null>(null);
  const [subCategoryInsights, setSubCategoryInsights] = useState<SubCategoryInsight[]>([]);
  
  // State for new visualizations
  const [trendData, setTrendData] = useState<{ x: string; y: number }[]>([]);
  const [autoResolvedPercent, setAutoResolvedPercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // In a real app, you'd fetch tickets for this category from an API
      const categoryTickets = ALL_MOCK_TICKETS.filter(t => t.category === category);
      setTickets(categoryTickets);

      if (categoryTickets.length > 0) {
        const [insightData, subCategoryData] = await Promise.all([
          getCategoryInsights(categoryTickets, category),
          getSubCategoryInsights(categoryTickets, category)
        ]);
        setInsights(insightData);
        setSubCategoryInsights(subCategoryData);

        // --- Mock data generation for new charts ---
        // 1. Calculate Auto-Resolved Percentage
        const autoResolvedCount = categoryTickets.filter(t => t.resolvedBy === 'AI').length;
        setAutoResolvedPercent(Math.round((autoResolvedCount / categoryTickets.length) * 100));

        // 2. Generate mock trend data for the last 30 days
        const trend = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            y: Math.floor(Math.random() * (20 + i / 2)) + 5, // Simulate a slight upward trend
          };
        });
        setTrendData(trend);
        // --- End of mock data generation ---

      } else {
        setInsights(null);
        setSubCategoryInsights([]);
        setTrendData([]);
        setAutoResolvedPercent(0);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [category]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }
  
  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="flex items-center gap-4">
        <button onClick={onNavigateBack} className="text-slate-400 hover:text-sky-400">&larr; Back to Dashboard</button>
        <h1 className="text-3xl font-bold text-slate-100">Insights for <span className="text-sky-400">{category}</span></h1>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl">
          <h2 className="text-xl font-semibold text-slate-300">No ticket data available for this category.</h2>
          <p className="text-slate-500 mt-2">AI insights cannot be generated without data.</p>
        </div>
      ) : (
        <>
          {/* A. Overview Cards */}
          {insights && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <OverviewCard title="Total Tickets" value={insights.keyMetrics.totalTickets} change={12} unit="" />
              <OverviewCard title="Avg. Resolution Time" value={parseInt(insights.keyMetrics.avgResolutionTime)} change={-5} unit="hours" invertChangeColor={true} />
              <OverviewCard title="Auto-Resolved by AI" value={autoResolvedPercent} change={8} unit="%" />
              <OverviewCard title="Customer Satisfaction (CSAT)" value={parseInt(insights.keyMetrics.csat)} change={2} unit="%" />
            </div>
          )}

          {/* B. Data Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
               <ChartCard title="Ticket Volume Trend" icon={TrendingUpIcon}>
                   <LineChart data={trendData} />
               </ChartCard>
            </div>
             <div className="lg:col-span-2">
                 {insights && (
                    <ChartCard title="Sentiment Analysis" icon={PieChartIcon}>
                        <DonutChart data={[
                        { label: 'Positive', value: insights.sentimentAnalysis.positive, color: '#34d399' }, // emerald-400
                        { label: 'Neutral', value: insights.sentimentAnalysis.neutral, color: '#60a5fa' }, // sky-400
                        { label: 'Negative', value: insights.sentimentAnalysis.negative, color: '#f87171' }, // red-400
                        ]} />
                    </ChartCard>
                 )}
            </div>
          </div>
          
          {subCategoryInsights.length > 0 && (
             <ChartCard title="Top Sub-Topics" icon={BarChart3Icon}>
                <HorizontalBarChart data={subCategoryInsights.map(d => ({ label: d.subCategoryName, value: d.percentage }))} />
             </ChartCard>
          )}

          {/* C. Ticket List */}
          <TicketTable tickets={tickets} onSuggestReply={generateSuggestedReply} />
        </>
      )}
    </div>
  );
};

export default CategoryInsightsPage;