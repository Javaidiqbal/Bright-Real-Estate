import React, { useState } from 'react';
import { LeadInquiry, LeadStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  Kanban, 
  List,
  Coins,
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';

export const LeadsCRM: React.FC = () => {
  const { 
    leads, 
    staffList, 
    updateLeadStatus, 
    addLeadNote, 
    assignLeadAgent,
    currentStaffUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('all');
  const [activeLeadForDetails, setActiveLeadForDetails] = useState<LeadInquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Status Columns for Kanban
  const KANBAN_COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'new', label: 'New Inbound', color: 'border-amber-400 bg-amber-50/40 text-amber-900' },
    { id: 'contacted', label: 'Contacted', color: 'border-blue-400 bg-blue-50/40 text-blue-900' },
    { id: 'tour_scheduled', label: 'Tour Scheduled', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-900' },
    { id: 'offer_submitted', label: 'Offer / Negotiation', color: 'border-purple-400 bg-purple-50/40 text-purple-900' },
    { id: 'closed', label: 'Deal Closed', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-900' },
  ];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.propertyTitle && l.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAgent = selectedAgentId === 'all' || l.assignedAgentId === selectedAgentId;
    return matchesSearch && matchesAgent;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForDetails || !newNoteText.trim()) return;

    addLeadNote(activeLeadForDetails.id, newNoteText.trim());
    setNewNoteText('');
    
    // update local reference
    const updatedLead = leads.find(l => l.id === activeLeadForDetails.id);
    if (updatedLead) {
      setActiveLeadForDetails({
        ...updatedLead,
        internalNotes: [...updatedLead.internalNotes, `[${new Date().toLocaleDateString()} by ${currentStaffUser?.name}]: ${newNoteText.trim()}`]
      });
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Leads & Inquiries CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {leads.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track client inquiries, VIP tour schedules, negotiation status, and advisor notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, property name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">Filter by Assigned Advisor</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const columnLeads = filteredLeads.filter(l => l.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col min-w-[250px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-bold shadow-xs">
                      {columnLeads.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {columnLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 italic">
                      No leads in {col.label}
                    </div>
                  ) : (
                    columnLeads.map((lead) => {
                      const agent = staffList.find(s => s.id === lead.assignedAgentId);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => setActiveLeadForDetails(lead)}
                          className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 truncate">
                              {lead.clientName}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 font-medium line-clamp-1 bg-slate-50 p-1.5 rounded-lg">
                            {lead.propertyTitle || 'General Advisory Request'}
                          </div>

                          {lead.tourDate && (
                            <div className="text-[10px] text-indigo-700 font-semibold flex items-center gap-1 bg-indigo-50 p-1.5 rounded-lg">
                              <Calendar className="w-3 h-3" />
                              <span>Tour: {lead.tourDate} @ {lead.tourTime}</span>
                            </div>
                          )}

                          {lead.budgetRange && (
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              <span>Budget: {lead.budgetRange}</span>
                            </div>
                          )}

                          {/* Footer Info & Assigned Agent */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{agent?.name || 'Unassigned'}</span>
                            <div className="flex items-center gap-1 font-semibold text-indigo-600 group-hover:underline">
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABULAR LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Property / Subject</th>
                  <th className="py-3.5 px-4">Tour Booking</th>
                  <th className="py-3.5 px-4">Budget / Prequal</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{lead.clientName}</div>
                      <div className="text-[11px] text-slate-500">{lead.clientEmail}</div>
                      <div className="text-[10px] text-slate-400">{lead.clientPhone}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {lead.propertyTitle || 'General Real Estate Inquiry'}
                      </div>
                      <div className="text-[11px] text-slate-500 italic line-clamp-1">
                        "{lead.message}"
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.tourDate ? (
                        <div className="text-indigo-700 font-semibold">
                          <div>{lead.tourDate} at {lead.tourTime}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{lead.tourType}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Inquiry Only</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>{lead.budgetRange || 'Flexible'}</div>
                      {lead.preApprovedMortgage && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Pre-Approved
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={lead.assignedAgentId}
                        onChange={(e) => assignLeadAgent(lead.id, e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                      >
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="tour_scheduled">Tour Scheduled</option>
                        <option value="offer_submitted">Offer Submitted</option>
                        <option value="closed">Closed Deal</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveLeadForDetails(lead)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Open Lead Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEAD DETAILS & NOTES MODAL / DRAWER */}
      {activeLeadForDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-bold font-serif">Lead Profile: {activeLeadForDetails.clientName}</h2>
                  <p className="text-[11px] text-slate-400">Created on {new Date(activeLeadForDetails.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <a href={`mailto:${activeLeadForDetails.clientEmail}`} className="font-bold text-indigo-600 hover:underline">
                    {activeLeadForDetails.clientEmail}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone</span>
                  <a href={`tel:${activeLeadForDetails.clientPhone}`} className="font-bold text-slate-900">
                    {activeLeadForDetails.clientPhone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Pre-Approval Status</span>
                  <span className="font-bold text-emerald-700">
                    {activeLeadForDetails.preApprovedMortgage ? 'Verified Pre-Approved' : 'Unverified'}
                  </span>
                </div>
              </div>

              {/* Status & Assignment controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={activeLeadForDetails.status}
                    onChange={(e) => {
                      updateLeadStatus(activeLeadForDetails.id, e.target.value as LeadStatus);
                      setActiveLeadForDetails({ ...activeLeadForDetails, status: e.target.value as LeadStatus });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="new">New Inbound Lead</option>
                    <option value="contacted">Agent Contacted</option>
                    <option value="tour_scheduled">VIP Tour Scheduled</option>
                    <option value="offer_submitted">Offer Submitted / Negotiation</option>
                    <option value="closed">Deal Closed & Commission Earned</option>
                    <option value="archived">Archived / Cold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Assigned Listing Advisor
                  </label>
                  <select
                    value={activeLeadForDetails.assignedAgentId}
                    onChange={(e) => {
                      assignLeadAgent(activeLeadForDetails.id, e.target.value);
                      setActiveLeadForDetails({ ...activeLeadForDetails, assignedAgentId: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inquiry Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Inquiry / Tour Note from Client
                </label>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic leading-relaxed">
                  "{activeLeadForDetails.message}"
                </div>
              </div>

              {/* Internal Notes History */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Internal Staff Notes & Activity Trail
                </label>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeLeadForDetails.internalNotes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                  ) : (
                    activeLeadForDetails.internalNotes.map((note, idx) => (
                      <div key={idx} className="text-xs bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl text-amber-950">
                        {note}
                      </div>
                    ))
                  )}
                </div>

                {/* Add note form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log a client conversation note or tour feedback..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Add Note</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setActiveLeadForDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
