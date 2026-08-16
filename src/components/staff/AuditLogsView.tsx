import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  Clock, 
  User, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, currentStaffUser } = useApp();

  const isSuperadmin = currentStaffUser?.role === 'superadmin';
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isSuperadmin) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Superadmin Audit Restricted</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          System audit logs track all property transactions, status overrides, and user privilege changes.
        </p>
        <p className="text-xs text-slate-600 bg-slate-100 p-3 rounded-xl">
          💡 Switch to <strong>Elena Vance (Superadmin)</strong> in the top bar to inspect audit trails.
        </p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filterType === 'all' || log.actionType.includes(filterType);
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionBadge = (type: string) => {
    if (type.includes('property_created')) {
      return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px] uppercase">Listing Created</span>;
    }
    if (type.includes('property_updated')) {
      return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px] uppercase">Listing Modified</span>;
    }
    if (type.includes('property_deleted')) {
      return <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px] uppercase">Listing Deleted</span>;
    }
    if (type.includes('staff')) {
      return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px] uppercase">Staff & RBAC</span>;
    }
    if (type.includes('lead')) {
      return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px] uppercase">Lead & Tour</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">{type}</span>;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              System Audit & Compliance Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Superadmin Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of all user activities, property modifications, role changes, and client transactions
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by description or user name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">All Action Categories</option>
            <option value="property">Property Operations</option>
            <option value="lead">Lead & Tour Inquiries</option>
            <option value="staff">Staff & Permission Changes</option>
            <option value="status">Status Transitions</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Initiated By</th>
                <th className="py-3.5 px-4">Activity Description</th>
                <th className="py-3.5 px-4 text-right">Target Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No audit events found for selected query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getActionBadge(log.actionType)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{log.userName}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                          log.userRole === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.userRole}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {log.description}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.targetId || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
