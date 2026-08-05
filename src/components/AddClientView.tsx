import React, { useState } from 'react';
import { UserPlus, Calendar, MapPin, FileText, User, ArrowLeft } from 'lucide-react';
import { Followup } from '../types';

interface AddClientViewProps {
  onAddClient: (client: Omit<Followup, 'id' | 'created_at' | 'is_completed'>) => void;
  onCancel: () => void;
  userId: string;
}

export const AddClientView: React.FC<AddClientViewProps> = ({ onAddClient, onCancel, userId }) => {
  const [clientName, setClientName] = useState('');
  // Default date = tomorrow at 10:00 AM formatted for datetime-local input
  const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  defaultDate.setMinutes(0);
  const formattedDefaultDate = defaultDate.toISOString().slice(0, 16);

  const [followupDate, setFollowupDate] = useState(formattedDefaultDate);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Client Name is compulsory.');
      return;
    }
    if (!followupDate) {
      setErrorMsg('Followup Date is compulsory.');
      return;
    }
    if (!notes.trim()) {
      setErrorMsg('Notes field is compulsory.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Location field is compulsory.');
      return;
    }

    setErrorMsg('');
    onAddClient({
      user_id: userId,
      client_name: clientName.trim(),
      followup_date: new Date(followupDate).toISOString(),
      notes: notes.trim(),
      location: location.trim(),
    });
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full flex flex-col justify-between">
      {/* Top Title & Cancel Button */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="text-[#8E8E93] hover:text-white text-xs font-medium flex items-center gap-1 bg-[#1C1C1E] px-3 py-1.5 rounded-lg border border-[#2C2C2E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5 text-[#007AFF]" />
              <span>Add Client Follow-Up</span>
            </h2>
          </div>
          <div className="w-16" /> {/* Spacer for symmetry */}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/40 rounded-xl text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form id="add-client-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Client Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Client Name *</span>
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Alexander Wright (Senior Tech Lead)"
              className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-xl px-3.5 py-3 outline-none transition-all"
            />
          </div>

          {/* Followup Date Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Followup Date & Time *</span>
            </label>
            <input
              type="datetime-local"
              required
              value={followupDate}
              onChange={(e) => setFollowupDate(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white text-sm rounded-xl px-3.5 py-3 outline-none transition-all color-scheme-dark"
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Location *</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Google Meet / Star Labs Campus"
              className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-xl px-3.5 py-3 outline-none transition-all"
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Notes *</span>
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write detailed notes regarding meeting agenda, expectations, or required follow-up items..."
              className="w-full bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-xl px-3.5 py-3 outline-none transition-all resize-none"
            />
          </div>
        </form>
      </div>

      {/* Center-Aligned Submit Button at Bottom */}
      <div className="pt-6 pb-4 flex justify-center">
        <button
          type="submit"
          form="add-client-form"
          className="w-full bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] font-semibold text-base py-3.5 px-8 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 transition-all active:scale-[0.98] text-center"
        >
          Submit Follow-Up
        </button>
      </div>
    </div>
  );
};
