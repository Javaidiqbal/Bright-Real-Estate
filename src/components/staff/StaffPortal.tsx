import React, { useState } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { StaffSidebar } from './StaffSidebar';
import { StaffDashboard } from './StaffDashboard';
import { ListingsManagement } from './ListingsManagement';
import { LeadsCRM } from './LeadsCRM';
import { TourCalendar } from './TourCalendar';
import { TeamManagement } from './TeamManagement';
import { CustomerManagement } from './CustomerManagement';
import { WebsiteEditor } from './WebsiteEditor';
import { AnalyticsView } from './AnalyticsView';
import { AuditLogsView } from './AuditLogsView';
import { ListingEditorModal } from './ListingEditorModal';
import { 
  Crown, 
  ShieldCheck, 
  Plus, 
  Globe, 
  LogOut,
  Bell,
  KeyRound,
  Settings
} from 'lucide-react';

export const StaffPortal: React.FC = () => {
  const { 
    currentUser, 
    activeStaffTab, 
    setInterface, 
    logout,
    leads,
    openAccountSettings
  } = useApp();

  const [isCreatingNewListing, setIsCreatingNewListing] = useState(false);

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const unreadLeadsCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="flex bg-slate-100 min-h-screen">
      
      {/* Staff Sidebar */}
      <StaffSidebar />

      {/* Main Staff View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Staff Navigation & Governance Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 capitalize font-serif">
                {activeStaffTab === 'team' ? 'Team & Role Governance' : activeStaffTab}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500">
                {isSuperadmin ? 'Superadmin Executive Control' : 'Staff Admin Panel'}
              </span>
            </div>

            {isSuperadmin && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-[11px] font-bold">
                <Crown className="w-3 h-3 text-purple-700" />
                <span>Superadmin: {SUPERADMIN_EMAIL}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* New Listing Action Button */}
            <button
              onClick={() => setIsCreatingNewListing(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Add New Listing</span>
            </button>

            {/* Switch to Public Site */}
            <button
              onClick={() => setInterface('public')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Preview Public Marketplace"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Public Site</span>
            </button>

            {/* Account Settings / Password */}
            <button
              onClick={() => openAccountSettings('password')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Change Password & Account Settings"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Security</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 overflow-y-auto pb-12">
          {activeStaffTab === 'dashboard' && (
            <StaffDashboard onOpenAddListing={() => setIsCreatingNewListing(true)} />
          )}

          {activeStaffTab === 'listings' && (
            <ListingsManagement />
          )}

          {activeStaffTab === 'leads' && (
            <LeadsCRM />
          )}

          {activeStaffTab === 'calendar' && (
            <TourCalendar />
          )}

          {activeStaffTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeStaffTab === 'team' && (
            <TeamManagement />
          )}

          {activeStaffTab === 'customers' && (
            <CustomerManagement />
          )}

          {activeStaffTab === 'website_editor' && (
            <WebsiteEditor />
          )}

          {activeStaffTab === 'audit' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Global Add Listing Modal */}
      {isCreatingNewListing && (
        <ListingEditorModal
          onClose={() => setIsCreatingNewListing(false)}
        />
      )}

    </div>
  );
};
