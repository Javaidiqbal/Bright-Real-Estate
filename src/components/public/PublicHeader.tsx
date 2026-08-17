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
  Phone,
  Menu,
  X,
  Sparkles
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaffRole = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
  const isSuperadmin = currentUser?.role === 'superadmin';

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={onScrollToExplore}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-md shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif flex items-center gap-1">
              BIGHT <span className="text-amber-600">REAL ESTATE</span>
            </div>
            <div className="text-[9px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-widest -mt-0.5">
              Luxury Real Estate Group
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <button 
            onClick={onScrollToExplore}
            className="hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Explore Properties</span>
          </button>

          <button 
            onClick={onOpenContactUs}
            className="hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold py-1"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            <span>Contact Us</span>
          </button>

          <button 
            onClick={onOpenInquiries}
            className="hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
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

        {/* Actions (PWA install + Favorites + Auth Controls + Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Prompt Button */}
          <div className="hidden sm:block">
            <PwaInstallPrompt />
          </div>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/40 transition-all cursor-pointer"
            title="Saved Properties"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 rounded-full bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center px-1 shadow-sm">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Conditional Auth State: Desktop & Compact Mobile View */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
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
                className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 sm:pr-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser?.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-300"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px] flex items-center gap-1">
                    {currentUser?.name}
                    {isSuperadmin && <Crown className="w-3 h-3 text-purple-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {isSuperadmin ? 'Superadmin' : currentUser?.role === 'admin' ? 'Staff Admin' : 'Client'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 sm:top-20 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
            
            {/* User Profile Bar on Mobile (if logged in) */}
            {isAuthenticated && currentUser && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {currentUser.name}
                      {isSuperadmin && <Crown className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isSuperadmin 
                    ? 'bg-purple-100 text-purple-800' 
                    : currentUser.role === 'admin'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isSuperadmin ? 'Superadmin' : currentUser.role === 'admin' ? 'Staff' : 'Client'}
                </span>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              <button
                onClick={() => handleMobileNav(onScrollToExplore)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span>Explore Properties</span>
                </div>
              </button>

              <button
                onClick={() => handleMobileNav(onOpenContactUs)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span>Contact Us & Advisory Hub</span>
                </div>
              </button>

              <button
                onClick={() => handleMobileNav(onOpenInquiries)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>My Bookings & Inquiries</span>
                </div>
                {myPublicInquiries.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    {myPublicInquiries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleMobileNav(onOpenFavorites)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span>Saved Properties</span>
                </div>
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>

            {/* Portal Switcher for Staff / Superadmin on Mobile */}
            {isStaffRole && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setInterface('staff');
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Enter {isSuperadmin ? 'Superadmin Executive Portal' : 'Admin Staff Portal'}</span>
                </button>
              </div>
            )}

            {/* Account Settings or Login / Signup buttons on mobile */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-slate-500" />
                    <span>Log In</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('signup');
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 shadow-sm transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Sign Up</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAccountSettings('password');
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <KeyRound className="w-4 h-4 text-amber-500" />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAccountSettings('profile');
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile PWA Install */}
            <div className="pt-2">
              <PwaInstallPrompt />
            </div>

          </div>
          
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
