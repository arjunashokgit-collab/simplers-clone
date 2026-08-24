import React, { useState } from 'react';
import { X, Check, Shield, Users, Hash, AtSign } from 'lucide-react';
import { sound } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [winnerCount, setWinnerCount] = useState(3);
  const [substituteCount, setSubstituteCount] = useState(2);
  const [minTagCount, setMinTagCount] = useState(1);
  const [mustFollow, setMustFollow] = useState(true);
  const [allowMultipleEntries, setAllowMultipleEntries] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#18181c] border border-white/15 rounded-3xl w-full max-w-[380px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold">Contest Rules & Filters</h3>
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

        {/* Form Settings */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Winners Count */}
          <div className="flex items-center justify-between bg-[#121215] p-3 rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <span className="font-semibold text-white">Number of Winners</span>
              <p className="text-[10px] text-white/50">Primary winner count</p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setWinnerCount(num);
                    sound.playClick();
                  }}
                  className={`w-7 h-7 rounded-lg font-bold transition-all ${
                    winnerCount === num
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Substitute / Backup Count */}
          <div className="flex items-center justify-between bg-[#121215] p-3 rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <span className="font-semibold text-white">Substitute Winners</span>
              <p className="text-[10px] text-white/50">Reserve winners if invalid</p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSubstituteCount(num);
                    sound.playClick();
                  }}
                  className={`w-7 h-7 rounded-lg font-bold transition-all ${
                    substituteCount === num
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Rules Toggle */}
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#121215] border border-white/5 cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <AtSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Must Follow Account</div>
                  <div className="text-[10px] text-white/50">Verify user follows creator</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mustFollow}
                onChange={(e) => {
                  setMustFollow(e.target.checked);
                  sound.playClick();
                }}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#121215] border border-white/5 cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">One Entry Per User</div>
                  <div className="text-[10px] text-white/50">Deduplicate repetitive spam comments</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!allowMultipleEntries}
                onChange={(e) => {
                  setAllowMultipleEntries(!e.target.checked);
                  sound.playClick();
                }}
                className="w-4 h-4 accent-blue-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#141418]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
