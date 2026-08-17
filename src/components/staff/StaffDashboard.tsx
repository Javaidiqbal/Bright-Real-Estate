import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Coins, 
  Users, 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Heart, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface StaffDashboardProps {
  onOpenAddListing: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onOpenAddListing }) => {
  const { 
    properties, 
    leads, 
    staffList, 
    currentStaffUser, 
    setActiveStaffTab,
    updateLeadStatus,
    setSelectedPropertyForDetail 
  } = useApp();

  const isSuperadmin = currentStaffUser?.role === 'superadmin';

  // Portfolio KPIs
  const totalPortfolioValue = properties.reduce((acc, p) => acc + (p.listingType === 'for_sale' ? p.price : 0), 0);
  const activeListingsCount = properties.filter(p => p.status === 'active').length;
  const pendingDealsCount = properties.filter(p => p.status === 'pending').length;
  const newLeads = leads.filter(l => l.status === 'new');
  const scheduledTours = leads.filter(l => l.status === 'tour_scheduled');

  const totalAgencySalesVolume = staffList.reduce((acc, s) => acc + s.salesVolume, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isSuperadmin ? 'Superadmin Executive View' : 'Internal Staff Agent Console'}
          </div>
          <h1 className="text-xl sm:text-3xl font-bold font-serif">
            Welcome back, {currentStaffUser?.name || 'Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isSuperadmin 
              ? 'Full executive control over all active listings, leads CRM, agent commissions, and team governance.'
              : `Managing your assigned exclusive listings, VIP client tours, and incoming buyer inquiries.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          <button
            onClick={onOpenAddListing}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Listing</span>
          </button>

          <button
            onClick={() => setActiveStaffTab('leads')}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Leads CRM</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Portfolio Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Portfolio</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {(totalPortfolioValue / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{activeListingsCount} Active</span>
            <span>• {pendingDealsCount} Under Contract</span>
          </div>
        </div>

        {/* Inbound Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pipeline Leads</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {leads.length} <span className="text-xs font-sans font-normal text-slate-500">Inquiries</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-amber-600 font-semibold">{newLeads.length} Require Contact</span>
          </div>
        </div>

        {/* Scheduled Tours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed VIP Tours</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {scheduledTours.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Upcoming private walkthroughs
          </div>
        </div>

        {/* Total Agency Sales Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Closed Volume (YTD)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {(totalAgencySalesVolume / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {staffList.length} licensed advisors
          </div>
        </div>

      </div>

      {/* Main Grid: Actionable Leads & Active Properties Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Recent Inquiries & Tour Requests */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold font-serif text-slate-900 text-lg">
                  Recent Inbound Leads & Tour Bookings
                </h3>
                <p className="text-xs text-slate-500">Live submissions from the public marketplace</p>
              </div>

              <button
                onClick={() => setActiveStaffTab('leads')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Open Leads CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        lead.status === 'new' 
                          ? 'bg-amber-100 text-amber-800' 
                          : lead.status === 'tour_scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{lead.clientName}</span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium truncate">
                      {lead.propertyTitle || 'General Inquiry'}
                    </div>

                    {lead.tourDate && (
                      <div className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Requested: {lead.tourDate} at {lead.tourTime} ({lead.tourType})</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 italic line-clamp-1">
                      "{lead.message}"
                    </div>
                  </div>

                  {/* Action Quick Toggle */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {lead.status === 'new' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'contacted', 'Contacted client via email/phone.')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow-xs"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {lead.status === 'contacted' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'tour_scheduled', 'Confirmed tour schedule with client.')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase rounded-lg shadow-xs"
                      >
                        Schedule Tour
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400">
                      Assigned: {lead.assignedAgentName || 'Agent'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-right">
            <button
              onClick={() => setActiveStaffTab('leads')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              View all {leads.length} inquiries in Kanban Pipeline →
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Quick Properties Overview & Actions */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold font-serif text-slate-900 text-lg">
                  Listings Overview
                </h3>
                <p className="text-xs text-slate-500">Live agency portfolio inventory</p>
              </div>

              <button
                onClick={() => setActiveStaffTab('listings')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Manage All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {properties.slice(0, 4).map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedPropertyForDetail(prop)}
                  className="group p-2.5 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-16 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        {prop.title}
                      </span>
                      <span className="text-xs font-bold font-serif text-slate-900 ml-2">
                        PKR {(prop.price / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{prop.neighborhood}, {prop.city}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        prop.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : prop.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenAddListing}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Create New Luxury Listing</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
