import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  ExternalLink,
  BarChart2,
  Share2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { ContestPost, Participant, WinnerSlotState } from '../types';
import { sound } from '../utils/audio';
import { RatingModal } from './RatingModal';

interface ScreenLiveWinnersProps {
  post: ContestPost;
  countdownSeconds: number;
  winnerCount: number;
  designatedWinners: Participant[];
  allParticipants: Participant[];
  onRestart: () => void;
  onOpenRules: () => void;
  onOpenShare: () => void;
}

export const ScreenLiveWinners: React.FC<ScreenLiveWinnersProps> = ({
  post,
  countdownSeconds,
  winnerCount,
  designatedWinners,
  allParticipants,
  onRestart,
  onOpenRules,
  onOpenShare,
}) => {
  // Memoize target winners so reference remains stable across renders
  const targetWinners = useMemo(() => {
    return Array.from({ length: winnerCount }, (_, i) => {
      return (
        designatedWinners[i] ||
        allParticipants[i % allParticipants.length] || {
          id: `gen-${i}`,
          username: `winner_${i + 1}`,
          fullName: `Winner ${i + 1}`,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          comment: '🎉 Winner!',
          isValid: true,
        }
      );
    });
  }, [winnerCount, designatedWinners, allParticipants]);

  const targetWinnersRef = useRef(targetWinners);
  useEffect(() => {
    targetWinnersRef.current = targetWinners;
  }, [targetWinners]);

  const [count, setCount] = useState<number>(countdownSeconds);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Initialize slots
  const [slotStates, setSlotStates] = useState<WinnerSlotState[]>(() =>
    Array.from({ length: winnerCount }, (_, idx) => ({
      slotIndex: idx,
      currentParticipant:
        allParticipants[(idx + 3) % allParticipants.length] || targetWinners[idx],
      currentNumber: countdownSeconds,
      isFinalized: false,
      isValid: true,
    }))
  );

  const [activeInfoModal, setActiveInfoModal] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);

  // Reset slots when winnerCount or countdown duration changes
  useEffect(() => {
    setCount(countdownSeconds);
    setIsDone(false);
    setShowRatingModal(false);
    setSlotStates(
      Array.from({ length: winnerCount }, (_, idx) => ({
        slotIndex: idx,
        currentParticipant:
          allParticipants[(idx + 3) % allParticipants.length] || targetWinners[idx],
        currentNumber: countdownSeconds,
        isFinalized: false,
        isValid: true,
      }))
    );
  }, [winnerCount, countdownSeconds, targetWinners, allParticipants]);

  // Show rating modal shortly after results are saved
  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowRatingModal(false);
    }
  }, [isDone]);

  // Fast shuffle interval during live countdown
  useEffect(() => {
    if (isDone) return;

    const shuffleInterval = setInterval(() => {
      setSlotStates((prev) =>
        prev.map((slot) => {
          if (slot.isFinalized) return slot;
          const randomIdx = Math.floor(Math.random() * allParticipants.length);
          return {
            ...slot,
            currentParticipant: allParticipants[randomIdx] || slot.currentParticipant,
          };
        })
      );
      try {
        sound.playShuffle();
      } catch {}
    }, 130);

    return () => clearInterval(shuffleInterval);
  }, [isDone, allParticipants]);

  // Main countdown timer
  useEffect(() => {
    if (isDone) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(timer);

          // Finalize all configured winners with designated participants!
          const currentWinners = targetWinnersRef.current;
          setSlotStates(
            Array.from({ length: winnerCount }, (_, i) => ({
              slotIndex: i,
              currentParticipant: currentWinners[i],
              currentNumber: 0,
              isFinalized: true,
              isValid: true,
            }))
          );
          setIsDone(true);
          try {
            sound.playWin();
          } catch {}

          // Confetti celebration blast
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#e60039', '#22c55e', '#ffffff', '#fbbf24'],
            });
          } catch {
            // Ignore if canvas is not ready
          }

          return 0;
        }

        try {
          sound.playTick(500 + next * 40);
        } catch {}

        // Update slot numbers
        setSlotStates((slots) =>
          slots.map((s) => ({
            ...s,
            currentNumber: next,
          }))
        );

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDone, winnerCount]);

  // Toggle Valid / Invalid
  const handleToggleValid = (slotIdx: number, valid: boolean) => {
    try {
      sound.playClick();
    } catch {}
    setSlotStates((prev) =>
      prev.map((slot, i) => (i === slotIdx ? { ...slot, isValid: valid } : slot))
    );
  };

  const handleRedo = () => {
    try {
      sound.playClick();
    } catch {}
    setIsDone(false);
    setCount(countdownSeconds);
    setShowRatingModal(false);
    setSlotStates(
      Array.from({ length: winnerCount }, (_, idx) => ({
        slotIndex: idx,
        currentParticipant:
          allParticipants[(idx + 3) % allParticipants.length] || targetWinners[idx],
        currentNumber: countdownSeconds,
        isFinalized: false,
        isValid: true,
      }))
    );
    onRestart();
  };

  // Helper to render an individual winner slot card
  const renderSlotCard = (slot: WinnerSlotState, idx: number, isWide: boolean = false) => {
    const p = slot.currentParticipant;
    return (
      <div
        key={idx}
        className={`bg-[#18181c] border border-white/10 rounded-2xl ${
          isWide ? 'p-3.5' : 'p-3'
        } flex flex-col items-center text-center relative shadow-md overflow-hidden min-h-[175px]`}
      >
        {/* Live Countdown Number Badge */}
        {!isDone && (
          <motion.div
            key={slot.currentNumber}
            initial={{ scale: 1.4, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute ${
              isWide ? 'top-2.5 right-3' : 'top-2 right-2'
            } text-rose-500 font-extrabold text-sm font-mono`}
          >
            {slot.currentNumber}
          </motion.div>
        )}

        {/* Avatar with dynamic animation */}
        <div className="relative my-1">
          <motion.div
            key={p.id + (isDone ? '_final' : '_spin')}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="relative"
          >
            <img
              src={p.avatarUrl}
              alt={p.username}
              className={`${
                isWide ? 'w-18 h-18' : 'w-16 h-16'
              } rounded-full object-cover ring-2 ${
                isDone ? 'ring-emerald-400' : 'ring-rose-500/60'
              } shadow-lg`}
            />
            {isDone && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <Check className="w-3 h-3 text-black stroke-[3.5]" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Username */}
        <div className="mt-1 font-semibold text-xs text-white/95 truncate w-full px-1">
          {p.username}
        </div>

        {/* Comment or GIF */}
        <div className="mt-1 flex items-center justify-center min-h-[30px] w-full px-1">
          {p.hasGif ? (
            <div className="flex items-center space-x-1 bg-black/60 border border-white/15 px-2 py-0.5 rounded-lg text-[10px] text-white">
              <div className="w-3.5 h-3.5 bg-rose-600 rounded text-[7px] font-bold flex items-center justify-center text-white">
                GIF
              </div>
              <span className="truncate">Race car</span>
            </div>
          ) : (
            <p className="text-[11px] text-white/70 italic truncate max-w-full px-1">
              {p.comment}
            </p>
          )}
        </div>

        {/* Finalized actions (Screen 5) */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full ${
              isWide ? 'max-w-[280px]' : ''
            } mt-2 pt-2 border-t border-white/5 space-y-2`}
          >
            <a
              href={`https://instagram.com/${p.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-rose-500 hover:text-rose-400 flex items-center justify-center space-x-1 font-medium"
            >
              <span>See on Instagram</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            {/* Stats & Check Action Row */}
            <div className="flex items-center justify-center space-x-2 pt-0.5">
              <button
                onClick={() => setActiveInfoModal(idx)}
                className="p-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                title="User Stats"
              >
                <BarChart2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  try {
                    sound.playClick();
                  } catch {}
                }}
                className="text-[10px] px-2.5 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/40 font-medium"
              >
                Check
              </button>
            </div>

            {/* Valid / Invalid toggle buttons */}
            <div className="flex items-center justify-center space-x-2 pt-1">
              <button
                onClick={() => handleToggleValid(idx, true)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                  slot.isValid
                    ? 'text-emerald-400 ring-1 ring-emerald-500 bg-emerald-500/10'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Valid
              </button>
              <button
                onClick={() => handleToggleValid(idx, false)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                  !slot.isValid
                    ? 'text-rose-500 ring-1 ring-rose-500 bg-rose-500/10'
                    : 'text-rose-500/50 hover:text-rose-400'
                }`}
              >
                Invalid
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Group slots into pairs and any single bottom slot
  const renderSlotsLayout = () => {
    if (slotStates.length === 1) {
      return <div className="pt-1">{renderSlotCard(slotStates[0], 0, true)}</div>;
    }

    if (slotStates.length % 2 === 1) {
      // Odd number of winners (e.g. 3 or 5): pairs on top, last single one centered wide
      const pairs = slotStates.slice(0, slotStates.length - 1);
      const last = slotStates[slotStates.length - 1];
      return (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            {pairs.map((slot, i) => renderSlotCard(slot, i, false))}
          </div>
          {renderSlotCard(last, slotStates.length - 1, true)}
        </div>
      );
    }

    // Even number of winners (e.g. 2 or 4)
    return (
      <div className="grid grid-cols-2 gap-3 pt-1">
        {slotStates.map((slot, i) => renderSlotCard(slot, i, false))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto text-white">
      <div className="space-y-3">
        {/* Subheader Post Title */}
        <div className="flex items-center justify-center space-x-2 text-xs text-white/80">
          <img
            src={post.authorAvatar}
            alt={post.title}
            className="w-4 h-4 rounded-full object-cover"
          />
          <span className="font-semibold">{post.title}</span>
        </div>

        {/* Winners Section Title */}
        <div className="text-center space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {winnerCount === 1 ? 'Winner' : 'Winners'}
          </h2>
          <p className="text-[11px] text-white/60">
            Via <span className="text-[#f43f5e] font-semibold">simpliers</span>{' '}
            Giveaway
          </p>
        </div>

        {/* Dynamic Winner Cards Layout */}
        {renderSlotsLayout()}

        {/* Results Are Saved! Banner (Screen 5) */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#18181c] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 text-black stroke-[3.5]" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Results Are Saved!
              </h3>
              <p className="text-xs text-white/60">
                Via <span className="text-[#f43f5e] font-semibold">simpliers</span>{' '}
                Giveaway
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Bottom Controls */}
      <div className="pt-3 pb-1 flex items-center justify-between border-t border-white/5 gap-2">
        <button
          onClick={() => {
            try {
              sound.playClick();
            } catch {}
            onOpenRules();
          }}
          className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl bg-[#202026] text-white/90 hover:bg-[#282830] active:scale-98 transition-all font-medium text-xs border border-white/5 shrink-0"
        >
          <span>Rules</span>
          <FileText className="w-3.5 h-3.5" />
        </button>

        {isDone && (
          <button
            onClick={handleRedo}
            className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl bg-[#202026] text-white/80 hover:text-white active:scale-98 transition-all font-medium text-xs border border-white/5 shrink-0"
            title="Repeat Draw"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>
        )}

        <button
          onClick={() => {
            try {
              sound.playClick();
            } catch {}
            onOpenShare();
          }}
          className="flex items-center justify-center space-x-1 py-2.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-98 transition-all text-white font-semibold text-xs shadow-md shadow-emerald-500/20 flex-1 justify-center"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share ▾</span>
        </button>
      </div>

      {/* User Stats Popup Modal */}
      {activeInfoModal !== null && slotStates[activeInfoModal] && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c1c22] border border-white/15 rounded-2xl p-4 w-full max-w-[320px] text-white space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-bold">User Audit Verification</h4>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={slotStates[activeInfoModal].currentParticipant.avatarUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold">
                  {slotStates[activeInfoModal].currentParticipant.username}
                </div>
                <div className="text-[10px] text-white/60">
                  {slotStates[activeInfoModal].currentParticipant.fullName}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-white/80 bg-[#121215] p-3 rounded-xl">
              <div className="flex justify-between">
                <span className="text-white/50">Follows Account:</span>
                <span className="text-emerald-400 font-semibold">Yes ✔</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Likes Post:</span>
                <span className="text-emerald-400 font-semibold">Yes ✔</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Duplicate Entries:</span>
                <span className="text-white/90">0 (Filtered)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Audited Timestamp:</span>
                <span className="text-white/90">10:53:48</span>
              </div>
            </div>
            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

      {/* App Store Rating Pop-up */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
};
