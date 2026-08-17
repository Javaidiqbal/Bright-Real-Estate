import React, { useState, useEffect } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  X, 
  AlertCircle,
  Crown,
  KeyRound,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    login, 
    signup,
    sendEmailAuthorizationCode,
    forgotPasswordReset
  } = useApp();

  const [tab, setTab] = useState<'login' | 'signup' | 'forgot_password'>(authModalTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Forgot Password flow states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sentCodePreview, setSentCodePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTab(authModalTab);
    setError(null);
    setSuccessMessage(null);
    setCodeSent(false);
    setSentCodePreview(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isSuperadminIdentifier = identifier.trim().toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() || email.trim().toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const handleSendRecoveryCode = async () => {
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setError('Please enter a valid registered email address to receive the authorization code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await sendEmailAuthorizationCode(recoveryEmail, 'password_recovery');
      if (res.success) {
        setCodeSent(true);
        setSentCodePreview(res.code);
        setSuccessMessage(`A 6-digit recovery code has been generated for ${recoveryEmail}.`);
      } else {
        setError(res.error || 'Failed to dispatch recovery code.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send recovery code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!recoveryCode || recoveryCode.length < 6) {
      setError('Please enter the 6-digit authorization code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPasswordReset(recoveryEmail, recoveryCode, newPassword);
      if (res.success) {
        setSuccessMessage('Password updated successfully! Signing you in...');
        setTimeout(async () => {
          await login(recoveryEmail, newPassword);
        }, 1000);
      } else {
        setError(res.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(identifier, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please check your credentials or password.');
        }
      } else if (tab === 'signup') {
        if (!phone.trim()) {
          setError('Mobile phone number is mandatory for account creation.');
          setIsLoading(false);
          return;
        }
        const res = await signup(name, email, 'client', phone, password);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 pt-7 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-lg">
            {tab === 'forgot_password' ? <KeyRound className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight text-white">
            BIGHT <span className="text-amber-400 font-sans font-medium text-base">REAL ESTATE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login' 
              ? 'Sign in with your Email Address or Mobile Number' 
              : tab === 'signup'
                ? 'Join our premier private client network'
                : 'Recover and reset your account password via verified email'}
          </p>

          {/* Tab Switcher */}
          {tab !== 'forgot_password' ? (
            <div className="mt-5 grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); setSuccessMessage(null); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'login' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(null); setSuccessMessage(null); }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'signup' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); setSuccessMessage(null); }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
              >
                ← Return to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[calc(85vh-150px)] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span>{successMessage}</span>
                {sentCodePreview && (
                  <div className="mt-1 font-mono font-bold text-slate-900 bg-emerald-100/70 px-2 py-1 rounded inline-block">
                    Authorization Code: {sentCodePreview}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {tab === 'forgot_password' ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="e.g. your.email@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {!codeSent ? (
                <button
                  type="button"
                  disabled={isLoading || !recoveryEmail}
                  onClick={handleSendRecoveryCode}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Send Recovery Authorization Code</span>
                </button>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        6-Digit Email Authorization Code *
                      </label>
                      <button
                        type="button"
                        onClick={handleSendRecoveryCode}
                        className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 849201"
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Password * (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? <span>Updating Password...</span> : <span>Reset Password & Sign In</span>}
                  </button>
                </>
              )}
            </form>
          ) : (
            /* LOGIN & SIGNUP VIEW */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
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
                      Email Address *
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number * <span className="text-[10px] text-slate-500 font-normal">(Used for signing in & alerts)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {tab === 'login' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address or Mobile Number *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. ijavaid91@gmail.com or +92 300 1234567"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Sign in with either your registered email address or your mobile phone number.
                  </p>
                </div>
              )}

              {/* Superadmin Automatic Recognition Notification */}
              {isSuperadminIdentifier && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
                  <Crown className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Superadmin Account Recognized</span>
                    <span className="text-[11px] text-purple-700">
                      Signing in as {SUPERADMIN_EMAIL} with full executive controls.
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password *
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setTab('forgot_password');
                        setError(null);
                        setSuccessMessage(null);
                        if (identifier.includes('@')) {
                          setRecoveryEmail(identifier);
                        }
                      }}
                      className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
          )}
        </div>
      </div>
    </div>
  );
};
