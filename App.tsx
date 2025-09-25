import React, { useState, useCallback } from 'react';
import { TicketCategory } from './types';
import Navbar from './Navbar';
import DashboardPage from './DashboardPage';
import CategoryInsightsPage from './CategoryInsightsPage';

type View = 'dashboard' | 'categoryInsights';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);

  const handleNavigateToCategory = useCallback((category: TicketCategory) => {
    setSelectedCategory(category);
    setView('categoryInsights');
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    setView('dashboard');
    setSelectedCategory(null);
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'categoryInsights':
        if (selectedCategory) {
          return <CategoryInsightsPage category={selectedCategory} onNavigateBack={handleNavigateToDashboard} />;
        }
        // Fallback to dashboard if no category is selected
        return <DashboardPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Navbar 
        onNavigateToDashboard={handleNavigateToDashboard} 
        onNavigateToCategory={handleNavigateToCategory} 
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
