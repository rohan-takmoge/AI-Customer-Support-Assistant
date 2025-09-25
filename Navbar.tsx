import React, { useState, useRef, useEffect } from 'react';
import { TicketCategory, CategoryGroup } from './types';
import { 
  BrainCircuitIcon, ChevronDownIcon, PackageIcon, CreditCardIcon, RefreshCwIcon, FileTextIcon,
  UserIcon, BugIcon, WrenchIcon, CodeXmlIcon, ShieldCheckIcon, BookOpenIcon, LockKeyholeIcon,
  MessageCircleHeartIcon, MegaphoneIcon, StarIcon, BarChart3Icon
} from './components/icons';

interface NavbarProps {
  onNavigateToDashboard: () => void;
  onNavigateToCategory: (category: TicketCategory) => void;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: 'Order & Payment',
    categories: [
      { name: TicketCategory.ORDER_STATUS, icon: PackageIcon },
      { name: TicketCategory.PAYMENT_ISSUE, icon: CreditCardIcon },
      { name: TicketCategory.REFUND_RETURN, icon: RefreshCwIcon },
      { name: TicketCategory.INVOICE_BILLING, icon: FileTextIcon },
    ],
  },
  {
    name: 'Technical Support',
    categories: [
      { name: TicketCategory.ACCOUNT_ISSUE, icon: UserIcon },
      { name: TicketCategory.TECHNICAL_BUG, icon: BugIcon },
      { name: TicketCategory.SETUP_HELP, icon: WrenchIcon },
      { name: TicketCategory.API_INTEGRATION, icon: CodeXmlIcon },
    ],
  },
  {
    name: 'Policy & Compliance',
    categories: [
      { name: TicketCategory.WARRANTY_GUARANTEE, icon: ShieldCheckIcon },
      { name: TicketCategory.RETURN_POLICY, icon: BookOpenIcon },
      { name: TicketCategory.PRIVACY_DATA, icon: LockKeyholeIcon },
    ],
  },
  {
    name: 'Customer Experience',
    categories: [
      { name: TicketCategory.FEEDBACK_SUGGESTION, icon: MessageCircleHeartIcon },
      { name: TicketCategory.COMPLAINT_ESCALATION, icon: MegaphoneIcon },
      { name: TicketCategory.LOYALTY_OFFERS, icon: StarIcon },
    ],
  },
];


const Navbar: React.FC<NavbarProps> = ({ onNavigateToDashboard, onNavigateToCategory }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: TicketCategory) => {
    onNavigateToCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onNavigateToDashboard} className="flex-shrink-0 flex items-center gap-2 group">
              <BrainCircuitIcon className="w-8 h-8 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <span className="text-xl font-bold text-slate-100 group-hover:text-slate-50 transition-colors hidden sm:block">Support AI Assistant</span>
            </button>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
            >
              <BarChart3Icon className="w-4 h-4" />
              Insights by Category
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-slate-800 border border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-in-up" style={{ animationDuration: '0.2s' }}>
                <div className="p-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.name} className="mb-2 last:mb-0">
                      <h3 className="px-3 py-1 text-xs font-bold uppercase text-slate-500">{group.name}</h3>
                      {group.categories.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => handleCategoryClick(cat.name)}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-300 rounded-md hover:bg-sky-500/10 hover:text-sky-300"
                          role="menuitem"
                        >
                          <cat.icon className="w-5 h-5" />
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
