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
  Settings,
  Menu,
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

export const StaffPortal: React.FC = () => {
  const { 
    currentUser, 
    activeStaffTab, 
    setActiveStaffTab,
    setInterface, 
    logout,
    leads,
    openAccountSettings
  } = useApp();

  const [isCreatingNewListing, setIsCreatingNewListing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const unreadLeadsCount = leads.filter(l => l.status === 'new').length;

  const tabTitles: Record<string, string> = {
    dashboard: 'Executive Dashboard',
    listings: 'Listings Portfolio',
    leads: 'Leads & Inquiries CRM',
    customers: 'Client Database',
    calendar: 'Tour Appointments',
    analytics: 'Market Analytics',
    website_editor: 'Website Copy CMS',
    team: 'Team & RBAC Governance',
    audit: 'System Audit Logs',
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      
      {/* Staff Sidebar (Persistent on Desktop, Drawer on Mobile) */}
      <StaffSidebar 
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Staff View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Staff Navigation & Governance Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-3.5 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open staff navigation menu"
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-bold text-slate-900 capitalize font-serif truncate">
                  {tabTitles[activeStaffTab] || activeStaffTab}
                </span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {isSuperadmin ? 'Superadmin Executive' : 'Staff Admin'}
                </span>
              </div>
            </div>

            {isSuperadmin && (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-[10px] font-bold shrink-0">
                <Crown className="w-3 h-3 text-purple-700" />
                <span>Superadmin Access</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* New Listing Action Button */}
            <button
              onClick={() => setIsCreatingNewListing(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-2.5 sm:px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Add Listing</span>
            </button>

            {/* Switch to Public Site */}
            <button
              onClick={() => setInterface('public')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Preview Public Marketplace"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            {/* Account Settings / Password */}
            <button
              onClick={() => openAccountSettings('password')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Change Password & Account Settings"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Security</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body (with padding-bottom on mobile to account for bottom quick bar) */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-12">
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

        {/* Mobile Quick Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-400 shadow-2xl">
          <button
            onClick={() => setActiveStaffTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeStaffTab === 'dashboard' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveStaffTab('listings')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeStaffTab === 'listings' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Listings</span>
          </button>

          <button
            onClick={() => setActiveStaffTab('leads')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium relative transition-colors ${
              activeStaffTab === 'leads' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>CRM Leads</span>
            {unreadLeadsCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveStaffTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeStaffTab === 'calendar' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Tours</span>
          </button>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium hover:text-slate-200 text-slate-400"
          >
            <MoreHorizontal className="w-4 h-4 mb-0.5" />
            <span>All Tabs</span>
          </button>
        </div>

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
