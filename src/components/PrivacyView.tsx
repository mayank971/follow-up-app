import React from 'react';
import { ShieldCheck, Lock, HardDrive, Mail, UserCheck } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-6 h-6 text-[#34C759]" />
        <h2 className="text-xl font-bold text-white tracking-tight">Privacy Policy</h2>
      </div>

      {/* Question 1: What is this? */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#34C759]" />
          <span>What is this?</span>
        </h3>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          This Privacy Policy outlines how the <strong>Follow Up</strong> application handles your user account data, client records, meeting dates, and application settings. We prioritize data privacy and minimalist data footprint above all else.
        </p>
      </div>

      {/* Question 2: What kind of data does Follow Up store? */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#007AFF]" />
          <span>What kind of data does Follow Up store?</span>
        </h3>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          Follow Up stores only the minimum essential information required to operate your schedule:
        </p>
        <ul className="text-xs text-[#8E8E93] space-y-1.5 list-disc list-inside pt-1">
          <li><strong>User Profile:</strong> Username, mobile number (for in-app password retrieval), and account password.</li>
          <li><strong>Follow-Up Records:</strong> Client name, scheduled meeting date, location, and meeting notes.</li>
          <li><strong>To-Do Items:</strong> Task name, completion state, and position order.</li>
          <li><strong>App Preferences:</strong> Push notification permission status.</li>
        </ul>
      </div>

      {/* Question 3: What information do you collect? */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#007AFF]" />
          <span>What information do you collect?</span>
        </h3>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          We do <strong>NOT</strong> collect analytics tracking pixels, advertising identifiers, cross-site cookies, or location telemetry. Data is stored directly on your device via standard client storage or securely in your connected Supabase PostgreSQL instance protected by Row Level Security (RLS).
        </p>
      </div>

      {/* Question 4: Who can I contact for Questions? */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-amber-400" />
          <span>Who can I contact for Questions?</span>
        </h3>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          If you have questions regarding this Privacy Policy, account management, or deployment details, please contact:
        </p>
        <div className="p-3 bg-[#0A0A0C] border border-[#2C2C2E] rounded-lg text-xs text-white mt-2 space-y-1">
          <p><strong>Maintainer:</strong> Mayank Patidar</p>
          <p><strong>Email:</strong> mayank.patidar@polivector.com</p>
          <p><strong>Mobile Number:</strong> +91 9171266305</p>
          <p><strong>Organization:</strong> Polivector</p>
        </div>
      </div>
    </div>
  );
};
