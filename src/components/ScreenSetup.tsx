import React, { useState } from 'react';
import { RefreshCw, Plus, Check, Sparkles, Info, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { ContestPost } from '../types';
import { sound } from '../utils/audio';

interface ScreenSetupProps {
  post: ContestPost;
  winnerCount: number;
  onSetWinnerCount: (count: number) => void;
  onContinue: () => void;
  onOpenRules: () => void;
}

export const ScreenSetup: React.FC<ScreenSetupProps> = ({
  post,
  winnerCount,
  onSetWinnerCount,
  onContinue,
  onOpenRules,
}) => {
  const [selectedOption, setSelectedOption] = useState<'new' | 'repeat'>('new');

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
      <div className="space-y-3.5">
        {/* Selected Video / Contest Post Card */}
        <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3 space-y-2.5 shadow-md">
          <div className="flex items-center space-x-2.5">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white/90 truncate">
                {post.authorUsername}
              </div>
              <div className="text-[10px] text-white/50">{post.authorName}</div>
            </div>
            {post.isVerified && (
              <div className="w-3.5 h-3.5 rounded-full bg-[#0095f6] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative">
              <img
                src={post.postImage}
                alt="Contest video/post preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs text-white/90 font-sans line-clamp-2 leading-relaxed">
                {post.caption}
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-white/60">
                <span>💬 {post.commentsCount} comments</span>
                <span>🤍 {post.likesCount} likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Winners Selector */}
        <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-semibold text-white/90 block">Number of Winners</span>
              <span className="text-[10px] text-white/50">Pick from configured winners</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-[#121215] border border-white/10 rounded-xl p-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSetWinnerCount(num);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  winnerCount === num
                    ? 'bg-[#e60039] text-white shadow-md shadow-rose-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-lg font-bold text-white tracking-tight">Continue by</h2>
        </div>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Repeat previous contest */}
          <button
            onClick={() => {
              setSelectedOption('repeat');
              sound.playClick();
            }}
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 text-center min-h-[130px] ${
              selectedOption === 'repeat'
                ? 'bg-[#18181f] border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-[#18181c] border border-white/10 hover:border-white/20'
            }`}
          >
            {selectedOption === 'repeat' && (
              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2.5">
              <RefreshCw className="w-5 h-5 text-white/80" />
            </div>
            <span className="text-xs font-semibold text-white/90 leading-tight">
              Repeat previous contest
            </span>
          </button>

          {/* Card 2: As a new contest */}
          <button
            onClick={() => {
              setSelectedOption('new');
              sound.playClick();
            }}
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 text-center min-h-[130px] ${
              selectedOption === 'new'
                ? 'bg-[#18181f] border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-[#18181c] border border-white/10 hover:border-white/20'
            }`}
          >
            {selectedOption === 'new' && (
              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
              </div>
            )}
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-2.5 shadow-md shadow-emerald-500/20">
              <Plus className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 leading-tight">
              As a new contest
            </span>
          </button>
        </div>

        {/* Purple Subscription Banner */}
        <div className="bg-gradient-to-r from-[#2c134b] to-[#1f0e34] border border-purple-800/40 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md">
          <div className="w-7 h-7 rounded-lg bg-[#9333ea] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-semibold text-purple-200">
            You've subscribed to <span className="underline decoration-purple-400">300,000 Entries</span>
          </p>
        </div>

        {/* Time Info Box */}
        <div className="bg-[#18181c] border border-white/5 rounded-2xl p-3 flex items-start space-x-2.5">
          <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center mt-0.5 shrink-0">
            <Info className="w-3 h-3 text-white/70" />
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            It will take less than 1 minute to receive entries.
          </p>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4 pb-2">
        <button
          onClick={() => {
            sound.playClick();
            onOpenRules();
          }}
          className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-[#202026] text-white/90 hover:bg-[#282830] active:scale-98 transition-all font-medium text-xs border border-white/5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Contest Rules</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-98 transition-all text-white font-semibold text-xs shadow-lg shadow-emerald-500/20"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
