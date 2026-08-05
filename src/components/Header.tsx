import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, MoreVertical, CheckSquare, Settings, Info, ShieldCheck, Database, LogOut, Lock, UserCheck } from 'lucide-react';
import { ActiveTab, Profile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: Profile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'add-client':
        return 'Add Client';
      case 'client-detail':
        return 'Client Details';
      case 'todo':
        return 'To-Do List';
      case 'settings':
        return 'Settings';
      case 'about':
        return 'About';
      case 'privacy':
        return 'Privacy Policy';
      case 'sql-guide':
        return 'SQL & Deploy Guide';
      case 'login':
        return 'Sign In';
      case 'forgot-credentials':
        return 'Retrieve Credentials';
      default:
        return 'Follow Up';
    }
  };

  const showBackButton = activeTab !== 'home';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/80 backdrop-blur-md border-b border-[#2C2C2E] transition-all">
      <div className="px-5 py-4 flex items-center justify-between relative">
        
        {/* Left Side: Back Arrow or Spacer */}
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={() => setActiveTab('home')}
              className="p-1 -ml-1 text-[#8E8E93] hover:text-white transition-colors focus:outline-none flex items-center gap-1"
              aria-label="Go Back to Home"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          ) : (
            <h1 className="text-[28px] font-semibold text-white tracking-[-0.5px] leading-tight">
              {getTitle()}
            </h1>
          )}
        </div>

        {/* Center Title when in Sub-view */}
        {showBackButton && (
          <h1 className="font-semibold text-lg text-white tracking-tight truncate max-w-[200px]">
            {getTitle()}
          </h1>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-3.5 justify-end">
          {/* To-Do Quick Button */}
          <button
            onClick={() => setActiveTab('todo')}
            className={`p-1 transition-colors ${
              activeTab === 'todo'
                ? 'text-[#007AFF]'
                : 'text-white hover:text-[#007AFF]'
            }`}
            title="To-Do List"
            aria-label="Open To-Do List"
          >
            <CheckSquare className="w-5 h-5 stroke-[2]" />
          </button>

          {/* 3-Dots Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-white hover:text-[#007AFF] transition-colors focus:outline-none flex flex-col gap-[3px] items-center justify-center"
              aria-label="Open Menu"
            >
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2C2C2E] flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#007AFF]" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('about');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2C2C2E] flex items-center gap-3 transition-colors"
                  >
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>About</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('privacy');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2C2C2E] flex items-center gap-3 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#34C759]" />
                    <span>Privacy Policy</span>
                  </button>

                  <div className="my-1 border-t border-[#2C2C2E]"></div>

                  {user ? (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out ({user.username})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#007AFF] hover:bg-[#007AFF]/10 flex items-center gap-3 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
