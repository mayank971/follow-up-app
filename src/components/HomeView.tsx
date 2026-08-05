import React, { useState } from 'react';
import { Plus, CheckCircle2, Calendar, MapPin, Search, ChevronDown, Check } from 'lucide-react';
import { Followup } from '../types';
import { formatFollowupDate } from '../lib/dateUtils';

interface HomeViewProps {
  followups: Followup[];
  loading?: boolean;
  onSelectClient: (client: Followup) => void;
  onAddClientClick: () => void;
  onToggleComplete: (id: string, currentStatus: boolean, e: React.MouseEvent) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  followups,
  loading = false,
  onSelectClient,
  onAddClientClick,
  onToggleComplete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Show 11 visible meetings initially as specified in Phase 3.2
  const [visibleCount, setVisibleCount] = useState(11);

  const filteredFollowups = followups.filter((f) =>
    f.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleItems = filteredFollowups.slice(0, visibleCount);
  const hasMore = filteredFollowups.length > visibleCount;

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] pb-32 px-0 pt-2 w-full relative">
      {/* Search Bar */}
      <div className="relative px-5 mb-2">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search client, notes or location..."
          className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-lg pl-10 pr-4 py-2 outline-none transition-all"
        />
      </div>

      {/* List Container */}
      <div className="flex-1">
        {loading ? (
          <div className="space-y-0 animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-[52px] px-5 border-b border-[#2C2C2E] flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 rounded bg-[#2C2C2E]" />
                  <div className="space-y-1.5 flex-1 max-w-[200px]">
                    <div className="h-3.5 bg-[#2C2C2E] rounded w-3/4" />
                    <div className="h-2.5 bg-[#2C2C2E]/60 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-[#2C2C2E] rounded w-12" />
              </div>
            ))}
          </div>
        ) : filteredFollowups.length === 0 ? (
          <div className="text-center py-16 px-5 bg-[#1C1C1E]/50 border-y border-[#2C2C2E]">
            <Calendar className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
            <p className="text-sm text-white font-medium">No follow-ups found</p>
            <p className="text-xs text-[#8E8E93] mt-1">Tap "+ Add Client" below to add your first client follow-up.</p>
          </div>
        ) : (
          visibleItems.map((item) => {
            const formattedDate = formatFollowupDate(item.followup_date);

            return (
              <div
                key={item.id}
                onClick={() => onSelectClient(item)}
                className={`group h-[52px] px-5 border-b border-[#2C2C2E] flex items-center justify-between cursor-pointer transition-colors hover:bg-[#1C1C1E]/60 gap-3 ${
                  item.is_completed ? 'opacity-70' : ''
                }`}
              >
                {/* Left Side: Tick Box + Client Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={(e) => onToggleComplete(item.id, item.is_completed, e)}
                    className="w-5 h-5 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
                    title={item.is_completed ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {item.is_completed ? (
                      <span className="text-[#007AFF] text-base font-bold select-none">✓</span>
                    ) : (
                      <div className="w-4 h-4 rounded-[4px] border border-[#3A3A3C] group-hover:border-[#007AFF] transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p
                      className={`text-[15px] font-normal leading-tight truncate ${
                        item.is_completed
                          ? 'text-[#8E8E93] line-through decoration-[#007AFF]/60'
                          : 'text-white'
                      }`}
                      title={item.client_name}
                    >
                      {item.client_name}
                    </p>
                    {item.location && (
                      <p className="text-[11px] text-[#8E8E93] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#8E8E93] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Tabular Numeric Date Label */}
                <div className="shrink-0 text-right min-w-[60px]">
                  <span
                    className={`text-sm font-medium tabular-nums whitespace-nowrap ${
                      item.is_completed
                        ? 'text-[#8E8E93]'
                        : formattedDate === 'today'
                        ? 'text-[#007AFF] font-semibold'
                        : formattedDate === 'tomorrow'
                        ? 'text-white'
                        : 'text-[#8E8E93]'
                    }`}
                  >
                    {formattedDate}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="py-4 text-center border-b border-[#2C2C2E]">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-4 py-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white text-xs font-medium rounded-lg transition-all inline-flex items-center gap-1.5 border border-[#2C2C2E]"
            >
              <span>Load More Meetings ({filteredFollowups.length - visibleCount} remaining)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Center-Aligned "Add Client" Primary Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[500px] px-5 z-30 flex justify-center pointer-events-none">
        <button
          onClick={onAddClientClick}
          className="pointer-events-auto bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] font-semibold text-base px-10 py-3.5 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-white/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="text-xl font-bold leading-none">+</span>
          <span>Add Client</span>
        </button>
      </div>
    </div>
  );
};
