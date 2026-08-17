import React from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  Lock, 
  Globe, 
  LogOut,
  Crown,
  KeyRound,
  Settings
} from 'lucide-react';

export const StaffSidebar: React.FC = () => {
  const { 
    currentUser,
    currentStaffUser, 
    activeStaffTab, 
    setActiveStaffTab,
    setInterface,
    logout,
    leads,
    openAccountSettings
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const navigationItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'listings', label: 'Listings Portfolio', icon: Home },
    { 
      id: 'leads', 
      label: 'Leads & Inquiries CRM', 
      icon: Users,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined
    },
    { id: 'customers', label: 'Customers & Clients', icon: Users },
    { id: 'calendar', label: 'Tour Appointments', icon: Calendar },
    { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
    // Superadmin Exclusive Tabs (governed by ijavaid91@gmail.com)
    ...(isSuperadmin ? [
      { id: 'website_editor', label: 'Website Copy Editor', icon: Globe, superadminOnly: true },
      { id: 'team', label: 'Staff & Roles (RBAC)', icon: ShieldCheck, superadminOnly: true },
      { id: 'audit', label: 'System Audit Logs', icon: FileText, superadminOnly: true },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      
      {/* Agency Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight font-serif flex items-center gap-1">
              BIGHT <span className="text-amber-400 font-sans text-xs">REAL ESTATE</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {isSuperadmin ? 'Superadmin Center' : 'Staff Workspace'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Operations
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeStaffTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveStaffTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.superadminOnly && !isActive && (
                  <Crown className="w-3.5 h-3.5 text-purple-400" title="Superadmin Control" />
                )}
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Superadmin Note for standard admin accounts */}
        {!isSuperadmin && (
          <div className="mt-4 mx-1 p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Access</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Staff RBAC & audit logs are reserved for the Superadmin ({SUPERADMIN_EMAIL}).
            </p>
          </div>
        )}
      </div>

      {/* Bottom Profile & Public Switcher */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/60">
        
        {/* Active Staff User Card with Settings Button */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {currentUser.name}
                  </span>
                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
                    isSuperadmin ? 'bg-purple-900 text-purple-300 border border-purple-700/60' : 'bg-indigo-900 text-indigo-300 border border-indigo-700/60'
                  }`}>
                    {isSuperadmin ? 'Super' : 'Admin'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate font-mono">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => openAccountSettings('password')}
              title="Change Password & Account Settings"
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Change Password & Security Action */}
        <button
          onClick={() => openAccountSettings('password')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700/40"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span>Security & Password</span>
        </button>

        {/* View Public Marketplace */}
        <button
          onClick={() => setInterface('public')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>View Public Marketplace</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  );
};
