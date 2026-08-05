import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, ExternalLink, Server, Globe } from 'lucide-react';

const SUPABASE_SQL_QUERY = `-- =========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR "FOLLOW UP" APP
-- =========================================================

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  mobile_number TEXT NOT NULL,
  push_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Followups Table
CREATE TABLE IF NOT EXISTS public.followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  followup_date TIMESTAMPTZ NOT NULL,
  notes TEXT NOT NULL,
  location TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  position_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Followups Policies
CREATE POLICY "Users can view own followups" ON public.followups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own followups" ON public.followups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own followups" ON public.followups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own followups" ON public.followups FOR DELETE USING (auth.uid() = user_id);

-- Todos Policies
CREATE POLICY "Users can view own todos" ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos" ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos" ON public.todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON public.todos FOR DELETE USING (auth.uid() = user_id);`;

export const SqlGuideView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_QUERY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-[#007AFF]" />
          <h2 className="text-xl font-bold text-white tracking-tight">Supabase & Deploy Setup</h2>
        </div>
        <button
          onClick={handleCopy}
          className="bg-[#2C2C2E] hover:bg-[#3A3A3C] border border-[#2C2C2E] text-[#007AFF] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
        </button>
      </div>

      {/* SQL Script Box */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8E8E93] font-semibold">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Step 1: Supabase PostgreSQL Schema Script
          </span>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20">
            RLS Enabled
          </span>
        </div>
        <pre className="bg-[#0A0A0C] border border-[#2C2C2E] text-[#007AFF] text-[11px] font-mono p-3 rounded-lg overflow-x-auto max-h-60 leading-relaxed scrollbar-thin">
          {SUPABASE_SQL_QUERY}
        </pre>
      </div>

      {/* Deployment Steps Summary */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-[#007AFF]" />
          <span>Step 5: Production Deployment Blueprint</span>
        </h3>

        {/* GitHub */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3.5 text-xs text-[#8E8E93] space-y-1">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            1. Push Repository to GitHub
          </p>
          <p className="text-[11px] text-[#8E8E93]">
            Run <code className="text-amber-300 bg-[#0A0A0C] px-1 py-0.5 rounded">git add . && git commit -m "Follow Up PWA"</code> and push to your GitHub repo.
          </p>
        </div>

        {/* Render */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3.5 text-xs text-[#8E8E93] space-y-1">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-[#007AFF]" />
            2. Host on Render
          </p>
          <p className="text-[11px] text-[#8E8E93]">
            Create a Static Site on Render connected to your GitHub repo. Set build command to <code className="text-amber-300 bg-[#0A0A0C] px-1 py-0.5 rounded">npm run build</code> and publish dir to <code className="text-amber-300 bg-[#0A0A0C] px-1 py-0.5 rounded">dist</code>.
          </p>
        </div>

        {/* Hostinger */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3.5 text-xs text-[#8E8E93] space-y-1">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#34C759]" />
            3. Hostinger Subdomain CNAME Configuration
          </p>
          <p className="text-[11px] text-[#8E8E93]">
            In Hostinger DNS Zone, add a <code className="text-[#34C759] bg-[#0A0A0C] px-1 py-0.5 rounded">CNAME</code> record pointing your subdomain (e.g., <code className="text-[#34C759]">followup.yourdomain.com</code>) to your Render web service URL.
          </p>
        </div>
      </div>
    </div>
  );
};
