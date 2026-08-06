import React, { useState } from 'react';
import { CheckCircle, Calendar, MapPin, FileText, Trash2, ArrowLeft, Clock, Check, RefreshCw, Edit2, Save, X } from 'lucide-react';
import { Followup } from '../types';
import { formatFullDateTime, formatFollowupDate } from '../lib/dateUtils';
import { updateFollowup } from '../lib/storage';

interface ClientDetailViewProps {
  client: Followup;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDeleteClient: (id: string) => void;
  onBack: () => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  onToggleComplete,
  onDeleteClient,
  onBack
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editName, setEditName] = useState(client.client_name);
  const [editLocation, setEditLocation] = useState(client.location);
  const [editNotes, setEditNotes] = useState(client.notes);
  
  // Format the ISO date so it fits perfectly in the HTML datetime-local input
  const getLocalDatetimeForInput = (isoString: string) => {
    const localDate = new Date(isoString);
    const tzOffset = localDate.getTimezoneOffset() * 60000;
    return new Date(localDate.getTime() - tzOffset).toISOString().slice(0, 16);
  };
  const [editDate, setEditDate] = useState(getLocalDatetimeForInput(client.followup_date));

  const handleToggleComplete = () => {
    onToggleComplete(client.id, client.is_completed);
    onBack();
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const updatedIsoDate = new Date(editDate).toISOString();
    
    // Save to database
    await updateFollowup(client.id, {
      client_name: editName,
      followup_date: updatedIsoDate,
      location: editLocation,
      notes: editNotes
    });

    // Force a smooth app reload so the home screen downloads the fresh data instantly
    window.location.reload();
  };

  const formattedDate = formatFollowupDate(client.followup_date);

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-[#8E8E93] hover:text-white text-xs font-medium flex items-center gap-1 bg-[#1C1C1E] px-3 py-1.5 rounded-lg border border-[#2C2C2E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          {!isEditing && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                client.is_completed
                  ? 'bg-[#007AFF]/20 text-[#007AFF] border border-[#007AFF]/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {client.is_completed ? 'Completed [✓]' : `Pending (${formattedDate})`}
            </span>
          )}
        </div>

        {isEditing ? (
          /* ================= EDIT MODE UI ================= */
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 mb-4 shadow-lg space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2C2C2E] pb-3 mb-2">
              <Edit2 className="w-4 h-4 text-[#007AFF]" />
              Edit Follow-up
            </h3>
            
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] mb-1.5 block uppercase tracking-wider">Client Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="w-full bg-[#0A0A0C] border border-[#2C2C2E] text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#007AFF] transition-colors" 
              />
            </div>
            
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] mb-1.5 block uppercase tracking-wider">Date & Time</label>
              <input 
                type="datetime-local" 
                value={editDate} 
                onChange={e => setEditDate(e.target.value)} 
                className="w-full bg-[#0A0A0C] border border-[#2C2C2E] text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#007AFF] transition-colors [&::-webkit-calendar-picker-indicator]:invert" 
              />
            </div>
            
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] mb-1.5 block uppercase tracking-wider">Location / Link</label>
              <input 
                type="text" 
                value={editLocation} 
                onChange={e => setEditLocation(e.target.value)} 
                className="w-full bg-[#0A0A0C] border border-[#2C2C2E] text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#007AFF] transition-colors" 
              />
            </div>
            
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] mb-1.5 block uppercase tracking-wider">Meeting Notes</label>
              <textarea 
                value={editNotes} 
                onChange={e => setEditNotes(e.target.value)} 
                rows={5} 
                className="w-full bg-[#0A0A0C] border border-[#2C2C2E] text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#007AFF] transition-colors resize-none" 
              />
            </div>
            
            <div className="flex gap-3 pt-3 mt-2 border-t border-[#2C2C2E]">
              <button 
                onClick={() => setIsEditing(false)} 
                disabled={isSaving}
                className="flex-1 py-2.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button 
                onClick={handleSaveChanges} 
                disabled={isSaving} 
                className="flex-[2] py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-[0_4px_14px_rgba(0,122,255,0.4)]"
              >
                {isSaving ? 'Saving...' : <><Save className="w-3.5 h-3.5"/> Save Changes</>}
              </button>
            </div>
          </div>
        ) : (
          /* ================= VIEW MODE UI ================= */
          <>
            {/* Client Card Header */}
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 mb-4 shadow-lg">
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug mb-2">
                {client.client_name}
              </h2>

              <div className="space-y-2 mt-4 pt-3 border-t border-[#2C2C2E] text-xs text-[#8E8E93]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#007AFF] shrink-0" />
                  <span>{formatFullDateTime(client.followup_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#007AFF] shrink-0" />
                  <span>{client.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8E8E93]">
                  <Clock className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <span>Created: {new Date(client.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-5 mb-6">
              <h3 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>Meeting Notes</span>
              </h3>
              <p className="text-sm text-white whitespace-pre-wrap leading-relaxed font-normal">
                {client.notes}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons (Only show if not currently editing) */}
      {!isEditing && (
        <div className="space-y-3 pt-4 pb-6">
          {/* Toggle Completion Button */}
          <button
            onClick={handleToggleComplete}
            className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              client.is_completed
                ? 'bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white border border-[#2C2C2E]'
                : 'bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20'
            }`}
          >
            {client.is_completed ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Mark as Pending (Remove Tick)</span>
              </>
            ) : (
              <>
                <span className="text-[#007AFF] text-lg font-bold">✓</span>
                <span>Mark as Completed (Add Tick)</span>
              </>
            )}
          </button>

          {/* Edit & Delete Row */}
          {!showDeleteConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-xs text-[#007AFF] hover:bg-[#007AFF]/10 border border-[#007AFF]/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-xs text-red-400 hover:bg-red-500/10 border border-red-900/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          ) : (
            <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-3 text-center animate-in fade-in">
              <p className="text-xs text-red-300 font-medium mb-2.5">
                Are you sure you want to delete this client follow-up?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-[#1C1C1E] text-xs text-[#8E8E93] rounded-lg border border-[#2C2C2E]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteClient(client.id);
                    onBack();
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-xs text-white font-semibold rounded-lg shadow-lg"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
