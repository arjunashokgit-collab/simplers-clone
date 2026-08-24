import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, MessageCircle, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ContestPost } from '../types';
import { sound } from '../utils/audio';

interface ScreenReceivingProps {
  post: ContestPost;
  onComplete: () => void;
}

export const ScreenReceiving: React.FC<ScreenReceivingProps> = ({ post, onComplete }) => {
  const [phase, setPhase] = useState<'initial_loading' | 'fetching' | 'completed'>('initial_loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Initial spinner for 1.2s
    const timer1 = setTimeout(() => {
      setPhase('fetching');
    }, 1200);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (phase === 'fetching') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPhase('completed');
              sound.playWin();
            }, 600);
            return 100;
          }
          return prev + 10;
        });
      }, 180);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Auto redirect after completion after 3.5s or click
  useEffect(() => {
    if (phase === 'completed') {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto text-white">
      <AnimatePresence mode="wait">
        {phase === 'initial_loading' && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-24 space-y-4"
          >
            <Loader2 className="w-10 h-10 text-white/70 animate-spin" />
          </motion.div>
        )}

        {phase === 'fetching' && (
          <motion.div
            key="fetching_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4 pt-1"
          >
            {/* Header / Giveaway Title */}
            <div className="text-center space-y-0.5">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {post.title}
              </h2>
              <div className="flex items-center justify-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
                <span className="text-xs font-semibold text-[#f43f5e]">
                  Receiving Entries
                </span>
              </div>
            </div>

            {/* Post Card */}
            <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                />
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-white/90">
                    {post.authorUsername}
                  </span>
                  {post.isVerified && (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0095f6] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Image & Post Details */}
              <div className="flex space-x-3 items-start">
                <img
                  src={post.postImage}
                  alt="Post preview"
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-sans">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-white/70">
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span>{post.commentsCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span>{post.likesCount}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-1 flex items-center space-x-2 text-emerald-400 font-medium text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All Comments are received</span>
              </div>
            </div>

            {/* Info Carousel & Progress */}
            <div className="bg-[#18181c] border border-white/10 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-white/40">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white" />
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xs font-semibold text-white">
                  This may take a few minutes
                </h3>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-[280px] mx-auto">
                  Collecting all comments and likes takes time and resources. This is the only way to keep your giveaway fair and secure.
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-[#272730] h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-[10px] text-emerald-400 font-bold">
                  {progress}%
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'completed' && (
          <motion.div
            key="completed_view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-5"
          >
            {/* Animated Green Badge with radial lines */}
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/40">
                  <Check className="w-9 h-9 text-black stroke-[3.5]" />
                </div>
              </div>

              {/* Decorative radial accents */}
              <div className="absolute -top-1 -right-2 w-3 h-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-60" />
            </div>

            <div className="space-y-2 max-w-[300px]">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Getting Entries Completed
              </h2>
              <p className="text-xs text-white/70 leading-relaxed">
                You will redirect automatically to result page of your giveaway.
              </p>
              <p className="text-xs text-white/60">
                If you don't want to wait, you can{' '}
                <button
                  onClick={() => {
                    sound.playClick();
                    onComplete();
                  }}
                  className="text-rose-500 underline font-semibold hover:text-rose-400"
                >
                  click here.
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Footer */}
      <div className="pt-4 pb-1 text-center border-t border-white/5">
        <p className="text-xs text-white/80 leading-relaxed max-w-[300px] mx-auto">
          Trusted by more than a hundred thousand world-famous{' '}
          <span className="font-bold text-white underline decoration-rose-500">Brands</span> and{' '}
          <span className="font-bold text-white underline decoration-rose-500">Influencers</span> for giveaway pickers.
        </p>
      </div>
    </div>
  );
};
