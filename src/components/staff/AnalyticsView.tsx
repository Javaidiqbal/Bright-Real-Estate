import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  Award, 
  Users, 
  Building2, 
  Eye, 
  CheckCircle2,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { properties, leads, staffList } = useApp();

  const totalClosedVolume = staffList.reduce((sum, s) => sum + s.salesVolume, 0);
  const totalActiveValue = properties.reduce((sum, p) => sum + (p.listingType === 'for_sale' ? p.price : 0), 0);
  const totalViews = properties.reduce((sum, p) => sum + p.viewsCount, 0);
  const totalInquiries = properties.reduce((sum, p) => sum + p.inquiriesCount, 0);

  // Category Distribution
  const categoriesCount: { [key: string]: { count: number; totalValue: number } } = {};
  properties.forEach(p => {
    if (!categoriesCount[p.category]) {
      categoriesCount[p.category] = { count: 0, totalValue: 0 };
    }
    categoriesCount[p.category].count += 1;
    categoriesCount[p.category].totalValue += p.price;
  });

  // Funnel stages
  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const tourCount = leads.filter(l => l.status === 'tour_scheduled').length;
  const offerCount = leads.filter(l => l.status === 'offer_submitted').length;
  const closedCount = leads.filter(l => l.status === 'closed').length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Market Analytics & Performance Intelligence
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Real-time sales conversion metrics, listing audience engagement, and advisor rankings
        </p>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Total Closed Volume (YTD)
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {(totalClosedVolume / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% YoY Agency Growth
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Active Inventory Value
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {(totalActiveValue / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {properties.length} exclusive listings
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Marketplace Impressions
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">
            High-intent luxury buyer views
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Inbound Lead Volume
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {leads.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {((tourCount / Math.max(1, leads.length)) * 100).toFixed(0)}% Tour conversion rate
          </div>
        </div>
      </div>

      {/* Grid: Lead Funnel & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Funnel */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">Client Acquisition Funnel</h3>
              <p className="text-xs text-slate-500">Conversion stages from public inquiries to closed contracts</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { stage: '1. Inbound Inquiries', count: leads.length, pct: 100, color: 'bg-indigo-600' },
              { stage: '2. Advisor Contacted', count: contactedCount + tourCount + offerCount + closedCount, pct: 85, color: 'bg-blue-600' },
              { stage: '3. VIP Tour Walkthrough', count: tourCount + offerCount + closedCount, pct: 60, color: 'bg-amber-600' },
              { stage: '4. Offer / Contract Drafted', count: offerCount + closedCount, pct: 35, color: 'bg-purple-600' },
              { stage: '5. Closed Escrow & Commission', count: closedCount, pct: 20, color: 'bg-emerald-600' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.stage}</span>
                  <span className="font-mono font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.max(12, item.pct)}%` }}
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold font-serif text-slate-900 text-base">Portfolio Distribution by Asset Class</h3>
              <p className="text-xs text-slate-500">Breakdown of active listings and capital allocation</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoriesCount).map(([catKey, data], i) => {
              const formattedName = catKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              const percentOfValue = ((data.totalValue / totalActiveValue) * 100).toFixed(0);

              return (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{formattedName}</span>
                    <span className="text-[11px] text-slate-500">{data.count} Properties Listed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-serif text-slate-900 block">PKR {(data.totalValue / 1000000).toFixed(1)}M</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">{percentOfValue}% of Portfolio</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Top Producing Advisors Leaderboard */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold font-serif text-slate-900 text-lg">
              Advisor Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-500">Rankings based on cumulative closed volume, commission tiers, and active listings</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Rank</th>
                <th className="pb-3 px-2">Advisor</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Active Listings</th>
                <th className="pb-3 px-2">Deals Closed</th>
                <th className="pb-3 px-2">Commission Tier</th>
                <th className="pb-3 px-2 text-right">Total Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...staffList].sort((a, b) => b.salesVolume - a.salesVolume).map((staff, idx) => (
                <tr key={staff.id} className="hover:bg-slate-50">
                  <td className="py-3 px-2 font-bold font-serif text-slate-900">#{idx + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <img src={staff.avatar} alt={staff.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-400">{staff.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      staff.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-700">{staff.activeListingsCount} Active</td>
                  <td className="py-3 px-2 font-semibold text-slate-700">{staff.totalDealsClosed} Deals</td>
                  <td className="py-3 px-2 font-mono font-semibold text-indigo-700">{staff.commissionRate}%</td>
                  <td className="py-3 px-2 text-right font-bold font-serif text-slate-900">
                    PKR {(staff.salesVolume / 1000000).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
