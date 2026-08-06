import React, { useState } from 'react';
import { Calendar, MapPin, Search, ChevronDown } from 'lucide-react';
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
  // Display exactly ~7 meetings per screen view as requested
  const [visibleCount, setVisibleCount] = useState(7);

  const filteredFollowups = followups.filter((f) =>
    f.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleItems = filteredFollowups.slice(0, visibleCount);
  const hasMore = filteredFollowups.length > visibleCount;

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] pb-32 px-0 pt-3 w-full relative">
      {/* Search Bar */}
      <div className="relative px-5 mb-3">
        <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search client, notes or location..."
          className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm font-medium rounded-xl pl-11 pr-4 py-3 outline-none transition-all shadow-sm"
        />
      </div>

      {/* List Container */}
      <div className="flex-1">
        {loading ? (
          <div className="space-y-0 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <div key={idx} className="min-h-[72px] px-5 py-3.5 border-b border-[#2C2C2E] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-6 h-6 rounded-md bg-[#2C2C2E]" />
                  <div className="space-y-2 flex-1 max-w-[220px]">
                    <div className="h-4 bg-[#2C2C2E] rounded-md w-3/4" />
                    <div className="h-3 bg-[#2C2C2E]/60 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-[#2C2C2E] rounded-md w-14" />
              </div>
            ))}
          </div>
        ) : filteredFollowups.length === 0 ? (
          <div className="text-center py-16 px-5 bg-[#1C1C1E]/50 border-y border-[#2C2C2E]">
            <Calendar className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
            <p className="text-base text-white font-semibold">No follow-ups found</p>
            <p className="text-xs text-[#8E8E93] mt-1">Tap "+ Add Client" below to schedule your client meetings.</p>
          </div>
        ) : (
          visibleItems.map((item) => {
            const formattedDate = formatFollowupDate(item.followup_date);

            return (
              <div
                key={item.id}
                onClick={() => onSelectClient(item)}
                className={`group min-h-[72px] px-5 py-3.5 border-b border-[#2C2C2E] flex items-center justify-between cursor-pointer transition-all hover:bg-[#1C1C1E]/80 gap-4 ${
                  item.is_completed ? 'opacity-65' : ''
                }`}
              >
                {/* Left Side: Tick Box + Client Name & Location */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => onToggleComplete(item.id, item.is_completed, e)}
                    className="w-6 h-6 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
                    title={item.is_completed ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {item.is_completed ? (
                      <span className="text-[#007AFF] text-lg font-extrabold select-none">✓</span>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-[#3A3A3C] group-hover:border-[#007AFF] transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p
                      className={`text-base font-semibold leading-snug truncate ${
                        item.is_completed
                          ? 'text-[#8E8E93] line-through decoration-[#007AFF]/60'
                          : 'text-white'
                      }`}
                      title={item.client_name}
                    >
                      {item.client_name}
                    </p>
                    {item.location && (
                      <p className="text-xs text-[#8E8E93] truncate flex items-center gap-1.5 mt-1 font-normal">
                        <MapPin className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Tabular Numeric Date Label */}
                <div className="shrink-0 text-right min-w-[68px]">
                  <span
                    className={`text-base font-bold tabular-nums whitespace-nowrap tracking-tight ${
                      item.is_completed
                        ? 'text-[#8E8E93]'
                        : formattedDate === 'today'
                        ? 'text-[#007AFF]'
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
          <div className="py-5 text-center border-b border-[#2C2C2E]">
            <button
              onClick={() => setVisibleCount((prev) => prev + 7)}
              className="px-5 py-2.5 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 border border-[#2C2C2E] shadow-sm"
            >
              <span>Load More Meetings ({filteredFollowups.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4 text-[#007AFF]" />
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
