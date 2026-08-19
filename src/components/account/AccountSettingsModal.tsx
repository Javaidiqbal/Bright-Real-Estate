import React, { useState, useEffect } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Mail, 
  Crown, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Sparkles,
  Shield,
  Save
} from 'lucide-react';

export const AccountSettingsModal: React.FC = () => {
  const { 
    currentUser, 
    isAccountSettingsOpen, 
    closeAccountSettings, 
    accountSettingsInitialTab,
    changePassword,
    updateUserProfile,
    sendEmailAuthorizationCode,
    forgotPasswordReset
  } = useApp();

  const [activeTab, setActiveTab] = useState<'password' | 'profile'>('password');
  
  // Password State
  const [passwordMode, setPasswordMode] = useState<'current_pw' | 'email_code'>('current_pw');
  const [currentPassword, setCurrentPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sentCodePreview, setSentCodePreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [isPwLoading, setIsPwLoading] = useState(false);

  // Profile State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (isAccountSettingsOpen) {
      setActiveTab(accountSettingsInitialTab || 'password');
      setPasswordMode('current_pw');
      setCurrentPassword('');
      setRecoveryCode('');
      setCodeSent(false);
      setSentCodePreview(null);
      setNewPassword('');
      setConfirmPassword('');
      setPwError(null);
      setPwSuccess(null);
      setProfileError(null);
      setProfileSuccess(null);

      if (currentUser) {
        setName(currentUser.name || '');
        setPhone(currentUser.phone || '');
        setTitle(currentUser.title || '');
      }
    }
  }, [isAccountSettingsOpen, accountSettingsInitialTab, currentUser]);

  if (!isAccountSettingsOpen || !currentUser) return null;

  const isSuperadmin = currentUser.role === 'superadmin' || currentUser.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  // Send Recovery Code for Password Change
  const handleSendSettingsRecoveryCode = async () => {
    setPwError(null);
    setIsPwLoading(true);
    try {
      const res = await sendEmailAuthorizationCode(currentUser.email, 'password_recovery');
      if (res.success) {
        setCodeSent(true);
        setSentCodePreview(res.code);
        setRecoveryCode(res.code);
        setPwSuccess(`A 6-digit authorization code has been sent to ${currentUser.email}.`);
      } else {
        setPwError(res.error || 'Failed to dispatch authorization code.');
      }
    } catch (err: any) {
      setPwError(err?.message || 'Failed to send recovery code.');
    } finally {
      setIsPwLoading(false);
    }
  };

  // Password submission handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!newPassword) {
      setPwError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation password do not match.');
      return;
    }

    setIsPwLoading(true);
    try {
      if (passwordMode === 'email_code') {
        if (!recoveryCode || recoveryCode.length < 6) {
          setPwError('Please enter the 6-digit authorization code.');
          setIsPwLoading(false);
          return;
        }
        const res = await forgotPasswordReset(currentUser.email, recoveryCode, newPassword);
        if (res.success) {
          setPwSuccess('Password reset successfully via verified email code!');
          setNewPassword('');
          setConfirmPassword('');
          setRecoveryCode('');
          setCodeSent(false);
        } else {
          setPwError(res.error || 'Failed to update password.');
        }
      } else {
        const res = await changePassword(currentPassword, newPassword);
        if (res.success) {
          setPwSuccess('Password updated successfully! Your account credentials are secured.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setPwError(res.error || 'Failed to update password.');
        }
      }
    } catch (err: any) {
      setPwError(err?.message || 'An unexpected error occurred while changing password.');
    } finally {
      setIsPwLoading(false);
    }
  };

  // Profile submission handler
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileError('Full name is required.');
      return;
    }

    setIsProfileLoading(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        title: title.trim(),
      });
      if (res.success) {
        setProfileSuccess('Profile information updated successfully.');
      } else {
        setProfileError(res.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setProfileError(err?.message || 'An unexpected error occurred while updating profile.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAccountSettings}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 pt-7 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                Account & Security Settings
              </h2>
              <p className="text-xs text-slate-400">
                Manage your credentials, password, and security preferences
              </p>
            </div>
          </div>

          {/* User Preview Mini Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-600 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                  {currentUser.name}
                  {isSuperadmin && <Crown className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
              isSuperadmin 
                ? 'bg-purple-900/80 text-purple-300 border border-purple-700/80' 
                : currentUser.role === 'admin'
                  ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/80'
                  : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/80'
            }`}>
              {isSuperadmin ? 'Superadmin' : currentUser.role === 'admin' ? 'Staff Admin' : 'Client'}
            </span>
          </div>

          {/* Tab Selection */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('password'); setPwError(null); setPwSuccess(null); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'password' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('profile'); setProfileError(null); setProfileSuccess(null); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Details</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(85vh-180px)] overflow-y-auto">
          
          {/* TAB 1: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="space-y-4">
              {pwError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pwError}</span>
                </div>
              )}

              {pwSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{pwSuccess}</span>
                  </div>
                  {sentCodePreview && (
                    <div className="flex items-center justify-between bg-white/90 border border-emerald-300 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Authorization Code:</span>
                        <span className="font-mono font-bold text-sm tracking-widest text-slate-900">{sentCodePreview}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRecoveryCode(sentCodePreview)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                      >
                        Use Code
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Password Verification Mode Selector */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-600 font-medium">Verification Method:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setPasswordMode('current_pw'); setPwError(null); setPwSuccess(null); }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      passwordMode === 'current_pw'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    Current Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPasswordMode('email_code'); setPwError(null); setPwSuccess(null); }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      passwordMode === 'email_code'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    Email Code
                  </button>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordMode === 'current_pw' ? (
                  /* Current Password Field */
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Current Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordMode('email_code');
                          handleSendSettingsRecoveryCode();
                        }}
                        className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Required to authenticate password changes.
                    </p>
                  </div>
                ) : (
                  /* Email Code Verification Mode */
                  <div className="space-y-2">
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-700" />
                        <span>Reset via Email Authorization:</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Code will be dispatched to your registered email: <strong className="font-mono">{currentUser.email}</strong>
                      </p>
                    </div>

                    {!codeSent ? (
                      <button
                        type="button"
                        disabled={isPwLoading}
                        onClick={handleSendSettingsRecoveryCode}
                        className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send 6-Digit Code to {currentUser.email}</span>
                      </button>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-700">
                            6-Digit Authorization Code *
                          </label>
                          <button
                            type="button"
                            onClick={handleSendSettingsRecoveryCode}
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
                            placeholder="e.g. 582049"
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1">Passwords do not match yet.</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match.
                    </p>
                  )}
                </div>

                {/* Password Criteria Card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Security Requirements:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                    <li className={newPassword.length >= 6 ? 'text-emerald-700 font-medium' : ''}>
                      Minimum 6 characters in length
                    </li>
                    <li>Recommended: Combine letters, numbers, and special symbols</li>
                    <li>Never share your credentials with unauthorized third parties</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPwLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isPwLoading ? (
                      <span>Updating Credentials...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {profileError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Account email is primary identifier and cannot be altered.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone Number
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

                {(isSuperadmin || currentUser.role === 'admin') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Portfolio Advisor"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isProfileLoading ? (
                      <span>Saving Profile...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-amber-400" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
