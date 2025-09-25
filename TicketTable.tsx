import React, { useState, useMemo } from 'react';
import { Ticket, TicketPriority, Sentiment, TicketStatus, priorityDetails } from './types';
import { SearchIcon, BotMessageSquareIcon, ChevronDownIcon } from './components/icons';

interface TicketTableProps {
  tickets: Ticket[];
  onSuggestReply: (content: string) => Promise<string>;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSuggestReply }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sentimentFilter, setSentimentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, { text: string; isLoading: boolean }>>({});

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.customerName.toLowerCase().includes(searchLower) ||
        ticket.content.toLowerCase().includes(searchLower);
      
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      const matchesSentiment = sentimentFilter === 'All' || ticket.sentiment === sentimentFilter;
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;

      return matchesSearch && matchesPriority && matchesSentiment && matchesStatus;
    });
  }, [tickets, searchQuery, priorityFilter, sentimentFilter, statusFilter]);

  const toggleRow = (ticketId: string) => {
    setExpandedRowId(prevId => (prevId === ticketId ? null : ticketId));
  };

  const handleSuggestReplyClick = async (ticket: Ticket) => {
    if (replies[ticket.id] && !replies[ticket.id].isLoading) {
      toggleRow(ticket.id);
      return;
    }
    setReplies(prev => ({ ...prev, [ticket.id]: { text: '', isLoading: true } }));
    setExpandedRowId(ticket.id);
    const replyText = await onSuggestReply(ticket.content);
    setReplies(prev => ({ ...prev, [ticket.id]: { text: replyText, isLoading: false } }));
  };

  const FilterDropdown: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
      <label htmlFor={`${label}-filter`} className="sr-only">{label}</label>
      <select 
        id={`${label}-filter`}
        value={value}
        onChange={onChange}
        className="bg-slate-700 border border-slate-600 rounded-md text-sm py-1.5 px-2 focus:ring-sky-500 focus:border-sky-500"
      >
        <option value="All">{label} (All)</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Ticket Drill-Down</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by ID, name, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md text-sm py-2 pl-10 pr-4 focus:ring-sky-500 focus:border-sky-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown label="Priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={Object.values(TicketPriority)} />
          <FilterDropdown label="Sentiment" value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)} options={Object.values(Sentiment)} />
          <FilterDropdown label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={Object.values(TicketStatus)} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3">Ticket ID</th>
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Summary</th>
              <th scope="col" className="px-4 py-3">Priority</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <React.Fragment key={ticket.id}>
                <tr className="border-b border-slate-700 hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-mono text-sky-400">{ticket.id}</td>
                  <td className="px-4 py-3">{ticket.customerName}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{ticket.summary}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${priorityDetails[ticket.priority].color} text-white`}>
                          {ticket.priority}
                      </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === TicketStatus.OPEN ? 'bg-amber-500/20 text-amber-300' :
                      ticket.status === TicketStatus.RESOLVED ? 'bg-green-500/20 text-green-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleSuggestReplyClick(ticket)}
                      className="text-sky-400 hover:text-sky-300 p-1 rounded-md hover:bg-sky-500/10 transition-colors"
                      title="Suggest AI Reply"
                      aria-label="Suggest AI Reply"
                    >
                       <BotMessageSquareIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                {expandedRowId === ticket.id && (
                   <tr className="bg-slate-800">
                     <td colSpan={6} className="p-0">
                       <div className="p-4 bg-slate-900/50 animate-slide-in-up" style={{animationDuration: '0.3s'}}>
                         <h4 className="font-bold text-slate-100 mb-2">AI Suggested Reply</h4>
                         {replies[ticket.id]?.isLoading ? (
                           <p className="text-slate-400 flex items-center gap-2">
                             <span className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-sky-400"></span>
                             Generating response...
                           </p>
                         ) : (
                           <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm border-l-2 border-sky-500 pl-4">
                             {replies[ticket.id]?.text}
                           </p>
                         )}
                       </div>
                     </td>
                   </tr>
                )}
              </React.Fragment>
            ))}
             {filteredTickets.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">No tickets found matching your criteria.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;