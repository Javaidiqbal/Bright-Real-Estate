import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PwaInstallPrompt } from '../common/PwaInstallPrompt';
import { 
  Building2, 
  Heart, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Compass,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Crown,
  ChevronDown,
  LayoutDashboard,
  KeyRound,
  Settings,
  Phone
} from 'lucide-react';

interface PublicHeaderProps {
  onOpenFavorites: () => void;
  onOpenInquiries: () => void;
  onOpenContactUs: () => void;
  onScrollToExplore: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onOpenFavorites,
  onOpenInquiries,
  onOpenContactUs,
  onScrollToExplore,
}) => {
  const { 
    favorites, 
    myPublicInquiries, 
    currentUser, 
    isAuthenticated, 
    openAuthModal, 
    logout, 
    setInterface,
    openAccountSettings
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isStaffRole = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
  const isSuperadmin = currentUser?.role === 'superadmin';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onScrollToExplore}>
          <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 font-serif flex items-center gap-1.5">
              BIGHT <span className="text-amber-600">REAL ESTATE</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-widest -mt-0.5">
              Luxury Real Estate Group
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button 
            onClick={onScrollToExplore}
            className="hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Explore Properties
          </button>

          <button 
            onClick={onOpenContactUs}
            className="hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            <span>Contact Us</span>
          </button>

          <button 
            onClick={onOpenInquiries}
            className="hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>My Bookings & Inquiries</span>
            {myPublicInquiries.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-center">
                {myPublicInquiries.length}
              </span>
            )}
          </button>
        </nav>

        {/* Actions (PWA install + Favorites + Auth Controls) */}
        <div className="flex items-center gap-3">
          {/* PWA Install Prompt Button */}
          <PwaInstallPrompt />

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/40 transition-all cursor-pointer"
            title="Saved Properties"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center px-1 shadow-sm">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Conditional Auth State: Not Logged In vs Logged In */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Logged in User Menu Toggle */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px] flex items-center gap-1">
                    {currentUser?.name}
                    {isSuperadmin && <Crown className="w-3 h-3 text-purple-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {isSuperadmin ? 'Superadmin' : currentUser?.role === 'admin' ? 'Staff Admin' : 'Client'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-slate-800 animate-in fade-in duration-150">
                    <div className="p-3 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{currentUser?.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser?.email}</div>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isSuperadmin 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : currentUser?.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isSuperadmin ? 'Superadmin Account' : currentUser?.role === 'admin' ? 'Staff Admin' : 'Verified Client'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      {/* If user is Staff or Superadmin, provide link to Staff Portal */}
                      {isStaffRole && (
                        <button
                          onClick={() => {
                            setInterface('staff');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                          <span>Enter {isSuperadmin ? 'Superadmin Portal' : 'Admin Portal'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenInquiries();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>My Tour Bookings ({myPublicInquiries.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenFavorites();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Properties ({favorites.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          openAccountSettings('password');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-amber-500" />
                        <span>Change Password</span>
                      </button>

                      <button
                        onClick={() => {
                          openAccountSettings('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Account Settings</span>
                      </button>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
