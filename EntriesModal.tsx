import React, { useState } from 'react';
import { Search, X, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';
import { PARTICIPANTS as DEFAULT_PARTICIPANTS } from '../data/mockData';
import { Participant } from '../types';
import { sound } from '../utils/audio';

interface EntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants?: Participant[];
  totalAuditedCount?: number;
}

export const EntriesModal: React.FC<EntriesModalProps> = ({
  isOpen,
  onClose,
  participants,
  totalAuditedCount,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const entriesList = participants || DEFAULT_PARTICIPANTS;
  const count = totalAuditedCount ?? entriesList.length;

  const filtered = entriesList.filter(
    (p) =>
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#18181c] border border-white/15 rounded-3xl w-full max-w-[380px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">All Retrieved Entries</h3>
            <p className="text-xs text-emerald-400 font-medium">{count} Valid Comments Audited</p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by username or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121215] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#121215] border border-white/5 rounded-2xl p-2.5 flex items-start space-x-3"
            >
              <img
                src={item.avatarUrl}
                alt={item.username}
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate">
                    {item.username}
                  </span>
                  <span className="text-[10px] text-white/40">{item.timeAgo || '1d'}</span>
                </div>
                <p className="text-xs text-white/80 mt-0.5 break-words">
                  {item.comment}
                </p>
                <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-white/50">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-rose-500/70" />
                    <span>{item.likesCount || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Eligible</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-white/40">
              No entries found matching "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#141418]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
