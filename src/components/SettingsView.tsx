import React, { useState } from 'react';
import { Settings, Bell, Lock, RotateCcw, UserX, KeyRound, Database, Check, AlertTriangle, Shield, LogIn } from 'lucide-react';
import { Profile } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { requestNotificationPermission, triggerPushNotification } from '../lib/notifications';

interface SettingsViewProps {
  user: Profile | null;
  onUpdatePush: (enabled: boolean) => void;
  onUpdatePassword: (newPassword: string) => void;
  onResetProfile: () => void;
  onDeleteAccount: () => void;
  onOpenLogin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdatePush,
  onUpdatePassword,
  onResetProfile,
  onDeleteAccount,
  onOpenLogin
}) => {
  // Confirmation Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Password Reset Form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePushToggle = async () => {
    if (!user) return;
    if (!user.push_enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        onUpdatePush(true);
        triggerPushNotification('Push Notifications Enabled', 'Follow Up will alert you 1 day before scheduled meetings.');
      } else {
        alert('Browser notification permission was denied. Please enable notifications in your browser settings.');
      }
    } else {
      onUpdatePush(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    onUpdatePassword(newPassword);
    setPasswordSuccess('Password updated successfully!');
    setPasswordError('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-6 h-6 text-[#007AFF]" />
        <h2 className="text-xl font-bold text-white tracking-tight">App Settings</h2>
      </div>

      {/* Profile Overview / In-App Login */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8E8E93] uppercase font-semibold">Account</p>
          <p className="text-base font-semibold text-white mt-0.5">
            {user ? `@${user.username}` : 'Not Signed In'}
          </p>
          {user && <p className="text-xs text-[#8E8E93] mt-0.5">Mobile: {user.mobile_number}</p>}
        </div>
        <button
          onClick={onOpenLogin}
          className="bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs font-semibold text-[#007AFF] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-[#2C2C2E]"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>{user ? 'Switch Account' : 'Sign In'}</span>
        </button>
      </div>

      {/* Push Notifications Toggle */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Push Notifications</p>
            <p className="text-xs text-[#8E8E93]">Alerts 1 day prior to scheduled meetings</p>
          </div>
        </div>
        <button
          onClick={handlePushToggle}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            user?.push_enabled ? 'bg-[#007AFF]' : 'bg-[#2C2C2E]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
              user?.push_enabled ? 'left-6' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Reset Password */}
      {user && (
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Security & Password</p>
                <p className="text-xs text-[#8E8E93]">Update your login password</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-xs font-semibold text-[#007AFF] bg-[#2C2C2E] px-3 py-1.5 rounded-lg border border-[#2C2C2E]"
            >
              {showPasswordForm ? 'Cancel' : 'Change'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 pt-4 border-t border-[#2C2C2E] space-y-3">
              {passwordSuccess && (
                <p className="text-xs text-[#34C759] font-medium bg-[#34C759]/10 p-2 rounded-lg border border-[#34C759]/20">
                  {passwordSuccess}
                </p>
              )}
              {passwordError && (
                <p className="text-xs text-red-400 font-medium bg-red-950/40 p-2 rounded-lg border border-red-800/30">
                  {passwordError}
                </p>
              )}
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white text-xs rounded-lg px-3 py-2.5 outline-none"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#2C2C2E] focus:border-[#007AFF] text-white text-xs rounded-lg px-3 py-2.5 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
              >
                Save New Password
              </button>
            </form>
          )}
        </div>
      )}



      {/* Database Integration Status */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Database Integration</p>
            <p className="text-xs text-[#8E8E93]">Direct Supabase API cloud persistence</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" /> Live
        </span>
      </div>

      {/* Account Danger Zone */}
      <div className="bg-[#1C1C1E] border border-red-900/40 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Account Management</span>
        </p>

        {/* Reset Profile */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2C2C2E]">
          <div>
            <p className="text-xs font-semibold text-white">Reset Profile Data</p>
            <p className="text-[11px] text-[#8E8E93]">Clears all follow-ups & todos for this account</p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs font-semibold text-amber-400 bg-amber-950/30 border border-amber-800/40 px-3 py-1.5 rounded-lg hover:bg-amber-950/60 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2C2C2E]">
          <div>
            <p className="text-xs font-semibold text-red-400">Delete Account</p>
            <p className="text-[11px] text-[#8E8E93]">Permanently remove account and all data</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-semibold text-red-300 bg-red-950/50 border border-red-800/50 px-3 py-1.5 rounded-lg hover:bg-red-900/60 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Reset Profile Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 max-w-sm w-full space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg w-fit">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirm Reset Profile Data?</h3>
              <p className="text-xs text-[#8E8E93] mt-1">
                This action will delete all client follow-ups and to-do items from your profile. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 bg-[#2C2C2E] text-xs font-semibold text-[#8E8E93] rounded-lg border border-[#2C2C2E]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProfile();
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white rounded-lg"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-red-900/50 rounded-xl p-5 max-w-sm w-full space-y-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg w-fit">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Permanently Delete Account?</h3>
              <p className="text-xs text-[#8E8E93] mt-1">
                Are you sure? This will permanently erase your profile credentials, mobile number, and all client records.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-[#2C2C2E] text-xs font-semibold text-[#8E8E93] rounded-lg border border-[#2C2C2E]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAccount();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
