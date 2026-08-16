import React, { useState, useEffect } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  X, 
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Crown
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    openAuthModal, 
    login, 
    signup 
  } = useApp();

  const [tab, setTab] = useState<'login' | 'signup'>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rolePreference, setRolePreference] = useState<'client' | 'admin'>('client');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isSuperadminEmail = email.trim().toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please check your credentials.');
        }
      } else {
        const res = await signup(name, email, rolePreference, phone, password);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickName?: string) => {
    setEmail(quickEmail);
    setError(null);
    setIsLoading(true);
    try {
      const res = await login(quickEmail, 'password123');
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 pt-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight text-white">
            BIGHT <span className="text-amber-400 font-sans font-medium text-base">REAL ESTATE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login' ? 'Access your luxury portfolio and portal' : 'Join our premier private client network'}
          </p>

          {/* Tab Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${
                tab === 'login' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${
                tab === 'signup' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[calc(85vh-150px)] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Wright"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRolePreference('client')}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                        rolePreference === 'client'
                          ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-semibold ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">Private Client</div>
                      <div className="text-[10px] text-slate-500">Buyer or Tenant</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRolePreference('admin')}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                        rolePreference === 'admin'
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">Staff / Agent</div>
                      <div className="text-[10px] text-slate-500">Admin Portal Access</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Superadmin Automatic Recognition Notification */}
            {isSuperadminEmail && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
                <Crown className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold block">Superadmin Verified</span>
                  <span className="text-[11px] text-purple-700">
                    Signing in with full executive governance and RBAC controls.
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In to Portal' : 'Create & Access Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Fast Login for Instant Testing */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Test Credentials
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
              {/* Superadmin Quick Login */}
              <button
                type="button"
                onClick={() => handleQuickLogin(SUPERADMIN_EMAIL, 'Ijaz Javaid')}
                className="w-full p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left flex items-center justify-between transition-colors text-xs text-purple-950 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-purple-900 block">Superadmin Portal</span>
                    <span className="text-[10px] text-purple-700 font-mono">{SUPERADMIN_EMAIL}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  1-Click Login
                </span>
              </button>

              {/* Admin Staff Quick Login */}
              <button
                type="button"
                onClick={() => handleQuickLogin('marcus.chen@bightrealestate.com', 'Marcus Chen')}
                className="w-full p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left flex items-center justify-between transition-colors text-xs text-indigo-950 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900 block">Admin Staff Portal</span>
                    <span className="text-[10px] text-indigo-700 font-mono">marcus.chen@bightrealestate.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
                  1-Click Login
                </span>
              </button>

              {/* Client Public Quick Login */}
              <button
                type="button"
                onClick={() => handleQuickLogin('client@bightrealestate.com', 'Client User')}
                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between transition-colors text-xs text-slate-800 font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Public Client User</span>
                    <span className="text-[10px] text-slate-500 font-mono">client@bightrealestate.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  1-Click Login
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
