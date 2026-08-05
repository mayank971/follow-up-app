import React, { useState } from 'react';
import { KeyRound, Lock, User, Phone, ArrowLeft, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Profile } from '../types';
import { loginUser, registerUser, retrieveCredentials } from '../lib/storage';

interface AuthModalProps {
  onSuccess: (user: Profile) => void;
  onCancel: () => void;
  initialView?: 'login' | 'forgot-credentials';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onCancel, initialView = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialView);

  // Common Fields
  const [username, setUsername] = useState('polivector');
  const [password, setPassword] = useState('followup2026');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [showPassword, setShowPassword] = useState(false);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [retrievedPassword, setRetrievedPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await loginUser(username, password);
    setLoading(false);

    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'Invalid username or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await registerUser(username, mobileNumber, password);
    setLoading(false);

    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRetrievedPassword(null);
    setLoading(true);

    const res = await retrieveCredentials(username, mobileNumber);
    setLoading(false);

    if (res.success && res.password) {
      setRetrievedPassword(res.password);
    } else {
      setErrorMsg(res.error || 'No matching account found.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-[#8E8E93] hover:text-white text-xs font-medium flex items-center gap-1 bg-[#2C2C2E] px-3 py-1.5 rounded-lg border border-[#2C2C2E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#007AFF]/20 border border-[#007AFF]/30 flex items-center justify-center text-[#007AFF] font-bold text-xs">
            FU
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to Follow Up' : mode === 'register' ? 'Create Account' : 'Retrieve Credentials'}
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1">
            {mode === 'login'
              ? 'Enter your credentials below'
              : mode === 'register'
              ? 'Required for credential recovery & cloud sync'
              : 'Match Username & Mobile Number to reveal password'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800/40 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. polivector"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-9 py-2.5 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] font-semibold text-sm py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            {/* Bottom Links */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrorMsg('');
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Forgot Credentials?
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="text-[#007AFF] hover:underline font-medium"
              >
                Create New Account
              </button>
            </div>
          </form>
        )}

        {/* Mode 2: REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Username *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose username"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Required for password recovery"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] font-semibold text-sm py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Register Profile'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="text-xs text-[#007AFF] hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode 3: FORGOT CREDENTIALS */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Username *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Registered mobile number"
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm py-3 rounded-full shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Retrieving...' : 'Reveal Account Password'}
            </button>

            {/* Password Revealed Directly On-Screen */}
            {retrievedPassword && (
              <div className="p-4 bg-[#34C759]/10 border border-[#34C759]/30 rounded-xl text-center space-y-1.5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-center gap-1.5 text-[#34C759] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Exact Match Found!</span>
                </div>
                <p className="text-[11px] text-[#8E8E93]">Your Account Password is:</p>
                <div className="bg-[#0A0A0C] border border-[#34C759]/40 text-[#34C759] font-mono text-base font-extrabold py-2 px-4 rounded-lg inline-block tracking-wider selection:bg-[#34C759]/40">
                  {retrievedPassword}
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setRetrievedPassword(null);
                }}
                className="text-xs text-[#007AFF] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
