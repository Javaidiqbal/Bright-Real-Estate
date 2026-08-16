import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicPortal } from './components/public/PublicPortal';
import { StaffPortal } from './components/staff/StaffPortal';
import { PropertyDetailModal } from './components/public/PropertyDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { AccountSettingsModal } from './components/account/AccountSettingsModal';

const AppContent: React.FC = () => {
  const { currentInterface, selectedPropertyForDetail, setSelectedPropertyForDetail } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Dynamic Interface Routing: Public Marketplace vs Staff Management Portal */}
      <div className="flex-1 flex flex-col">
        {currentInterface === 'public' ? (
          <PublicPortal />
        ) : (
          <StaffPortal />
        )}
      </div>

      {/* Global Property Detail Modal (available in staff preview mode) */}
      {selectedPropertyForDetail && currentInterface === 'staff' && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          onClose={() => setSelectedPropertyForDetail(null)}
        />
      )}

      {/* Global Login / Sign Up Authentication Modal */}
      <AuthModal />

      {/* Global Account & Password Settings Modal */}
      <AccountSettingsModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
