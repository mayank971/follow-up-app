import React, { useState } from 'react';
import { User, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';
import { loginUser, registerUser } from '../lib/storage';
import { Profile } from '../types';

interface LoginViewProps {
  onSuccess: (user: Profile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both Username and Password.');
      return;
    }

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
    if (!username.trim() || !mobileNumber.trim() || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);
    const res = await registerUser(username, mobileNumber, password);
    setLoading(false);

    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    const res = await loginUser('polivector', 'followup2026');
    setLoading(false);
    if (res.success && res.user) {
      onSuccess(res.user);
    }
  };

  return (
    <div className="min-h-dvh bg-[#F2F2F7] text-slate-900 flex flex-col justify-between items-center px-4 py-8 relative antialiased selection:bg-[#007AFF]/20 selection:text-[#007AFF]">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-emerald-100/60 via-blue-50/40 to-transparent pointer-events-none rounded-b-full blur-3xl -z-10" />

      {/* Top Main Container */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center">
        
        {/* Animated Brand Header */}
        <div className="flex flex-col items-center text-center mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
          <Logo size={96} className="mb-4 shadow-[0_16px_36px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform" />
          
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Follow Up
          </h1>
          <p className="text-xs font-medium text-slate-500 tracking-wide max-w-[260px]">
            Client Meeting & Schedule Manager
          </p>
        </div>

        {/* Elevated Form Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-500">
          
          {/* Mode Selector Tabs */}
          <div className="flex bg-[#E5E5EA]/70 p-1 rounded-2xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all text-center ${
                mode === 'forgot'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Forgot
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode 1: SIGN IN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-[#F2F2F7] border border-[#E5E5EA] focus:border-[#007AFF] focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F2F2F7] border border-[#E5E5EA] focus:border-[#007AFF] focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-10 py-3 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-sm py-3.5 px-6 rounded-full shadow-[0_10px_25px_rgba(0,122,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Quick Entry */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="text-xs text-[#007AFF] font-medium hover:underline inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>One-click Demo Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username"
                    className="w-full bg-[#F2F2F7] border border-[#E5E5EA] focus:border-[#007AFF] focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full bg-[#F2F2F7] border border-[#E5E5EA] focus:border-[#007AFF] focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full bg-[#F2F2F7] border border-[#E5E5EA] focus:border-[#007AFF] focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3.5 px-6 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Mode 3: FORGOT PASSWORD SECURITY NOTICE */}
          {mode === 'forgot' && (
            <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Password Security Notice
              </h3>

              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  For security compliance, passwords are encrypted. Please contact your system administrator to issue a secure password reset.
                </p>
              </div>

              <div className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-2xl p-4 text-left space-y-1 text-xs">
                <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Administrator Support Contact</span>
                </p>
                <p className="text-slate-600"><strong>System Admin:</strong> Mayank Patidar</p>
                <p className="text-slate-600"><strong>Email:</strong> mayank.patidar@polivector.com</p>
                <p className="text-slate-600"><strong>Help Line:</strong> +91 9171266305</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="w-full mt-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-sm py-3 px-6 rounded-full shadow-[0_10px_25px_rgba(0,122,255,0.3)] transition-all active:scale-[0.98]"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Footer */}
      <footer className="w-full text-center mt-8 pb-2">
        <p className="text-[11px] text-[#8E8E93] font-medium tracking-widest uppercase">
          created by Polivector
        </p>
      </footer>
    </div>
  );
};
