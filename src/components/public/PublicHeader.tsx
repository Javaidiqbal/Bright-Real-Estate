import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Sparkles,
  Clock
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
    setActiveStaffTab,
    openAccountSettings
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaffRole = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
  const isSuperadmin = currentUser?.role === 'superadmin';

  // Prevent background scrolling and handle Escape key when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

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
                        <>
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

                          <button
                            onClick={() => {
                              setActiveStaffTab('attendance');
                              setInterface('staff');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Attendance & Time Clock</span>
                          </button>
                        </>
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

      {/* Full-Height Vertical Side Drawer for Mobile Navigation Rendered in Portal */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="md:hidden fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Vertical Side Panel Drawer */}
          <aside className="relative z-10 w-[85vw] max-w-sm bg-white h-[100dvh] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header with Logo & Close Button */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight text-white font-serif flex items-center gap-1">
                    BIGHT <span className="text-amber-400">REAL ESTATE</span>
                  </div>
                  <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                    Luxury Real Estate Group
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Logged-In User Profile Banner */}
              {isAuthenticated && currentUser ? (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                        {currentUser.name}
                        {isSuperadmin && <Crown className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    isSuperadmin 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : currentUser.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isSuperadmin ? 'Superadmin' : currentUser.role === 'admin' ? 'Staff' : 'Client'}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm space-y-2.5">
                  <div className="text-xs font-bold font-serif flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Welcome to Bight Real Estate</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Sign in to manage your viewing appointments, bookmark prime properties, and connect with private advisors.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleMobileNav(() => openAuthModal('login'))}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In</span>
                    </button>
                    <button
                      onClick={() => handleMobileNav(() => openAuthModal('signup'))}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Core Navigation Links */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Navigation
                </div>

                <button
                  onClick={() => handleMobileNav(onScrollToExplore)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span>Explore Properties</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">View All</span>
                </button>

                <button
                  onClick={() => handleMobileNav(onOpenContactUs)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>Contact & Advisory Hub</span>
                  </div>
                </button>

                <button
                  onClick={() => handleMobileNav(onOpenInquiries)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
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
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span>Saved Properties</span>
                  </div>
                  {favorites.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Staff / Superadmin Executive Portal Switcher */}
              {isStaffRole && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Internal Governance
                  </div>
                  <button
                    onClick={() => handleMobileNav(() => setInterface('staff'))}
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:from-slate-800 hover:to-indigo-900 transition-all text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{isSuperadmin ? 'Superadmin Executive' : 'Staff Admin Panel'}</div>
                      <div className="text-[10px] text-slate-300 font-normal lowercase tracking-normal">Switch to back-office</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleMobileNav(() => {
                      setActiveStaffTab('attendance');
                      setInterface('staff');
                    })}
                    className="w-full flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-amber-100 transition-all text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Attendance & Time Clock</div>
                      <div className="text-[10px] text-amber-800 font-normal lowercase tracking-normal">Clock in, out & break tracker</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Account Management (If Logged In) */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Account & Security
                  </div>

                  <button
                    onClick={() => handleMobileNav(() => openAccountSettings('password'))}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => handleMobileNav(() => openAccountSettings('profile'))}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Account Profile Settings</span>
                  </button>

                  <button
                    onClick={() => handleMobileNav(logout)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Quick Advisory Contact Info */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Direct Advisory Desk</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">+44 20 7946 0912</p>
                  <p className="text-[10px] text-slate-400">Monday – Sunday, 8am – 9pm GMT</p>
                </div>
              </div>

              {/* Mobile PWA Install */}
              <div className="pt-1">
                <PwaInstallPrompt />
              </div>

            </div>

            {/* Side Drawer Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 shrink-0">
              Bight Real Estate Group • Luxury Real Estate Portal
            </div>

          </aside>
        </div>,
        document.body
      )}
    </header>
  );
};
