import React from 'react';
import { Info, CheckCircle2, Shield, Heart, Sparkles, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const AboutView: React.FC = () => {
  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-6 h-6 text-[#007AFF]" />
        <h2 className="text-xl font-bold text-white tracking-tight">About Follow Up</h2>
      </div>

      {/* App Overview */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#007AFF]" />
          <span>What does it do?</span>
        </h3>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          <strong>Follow Up</strong> is an iOS-inspired, ultra-clean Progressive Web App (PWA) designed for professionals, sales executives, freelancers, and project managers to effortlessly track client meetings, follow-up dates, locations, and action items.
        </p>
      </div>

      {/* How to use */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#007AFF]" />
          <span>How do I use it?</span>
        </h3>
        <ul className="text-xs text-[#8E8E93] space-y-2 list-disc list-inside">
          <li><strong>Add Client:</strong> Tap the "+ Add Client" button on the home screen to schedule follow-ups with compulsory client name, date, notes, and location.</li>
          <li><strong>Completion Blue Tick:</strong> Tap any client row to open details, and mark "Completed". A left-aligned blue tick [✓] will appear on their row on Home.</li>
          <li><strong>To-Do Module:</strong> Tap the To-Do icon in the header to manage daily action checklists with custom reordering.</li>
          <li><strong>PWA Installation:</strong> Add "Follow Up" to your Home Screen on iOS or Android for native app-like experience and Web Push alerts.</li>
        </ul>
      </div>

      {/* Version Details & Active Mode */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 space-y-2.5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Version & Mode Details</span>
        </h3>
        <div className="text-xs text-[#8E8E93] space-y-1.5 pt-1">
          <div className="flex justify-between py-1 border-b border-[#2C2C2E]">
            <span className="text-[#8E8E93]">App Version</span>
            <span className="text-white font-mono font-medium">v1.2.0 (PWA Mode)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#2C2C2E]">
            <span className="text-[#8E8E93]">Active Data Mode</span>
            <span className="text-amber-300 font-medium">
              {isSupabaseConfigured ? 'Supabase Live Database (Production)' : 'Supabase Database Connected'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#2C2C2E]">
            <span className="text-[#8E8E93]">Viewport Layout</span>
            <span className="text-[#34C759] font-medium">iOS Resizable Keyboard Engine</span>
          </div>
        </div>
      </div>

      {/* Attribution & Copyrights */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 text-center space-y-2">
        <p className="text-xs text-[#8E8E93] font-semibold tracking-wider uppercase">Credits & Copyrights</p>
        <p className="text-sm font-bold text-white">Created by: Polivector</p>
        <p className="text-xs text-[#8E8E93] font-medium">Copyrights 2026 Mayank Patidar</p>
        <div className="pt-2 text-[11px] text-[#007AFF] flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-[#007AFF] text-[#007AFF]" />
          <span>Crafted for Seamless Multi-Device Performance</span>
        </div>
      </div>
    </div>
  );
};
