import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ShieldCheck, Loader2, Play, Users, Clock } from 'lucide-react';
import { ContestPost } from '../types';
import { sound } from '../utils/audio';

interface ScreenResultPreProps {
  post: ContestPost;
  countdownSeconds: number;
  onSetCountdownSeconds: (sec: number) => void;
  onStartContest: () => void;
  onSeeEntries: () => void;
}

export const ScreenResultPre: React.FC<ScreenResultPreProps> = ({
  post,
  countdownSeconds,
  onSetCountdownSeconds,
  onStartContest,
  onSeeEntries,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);
  const [showTimerSelect, setShowTimerSelect] = useState(false);

  useEffect(() => {
    // Initial brief shuffle simulation
    const timer = setTimeout(() => {
      setIsShuffling(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(post.resultCode);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${post.resultLink}`);
    setCopiedLink(true);
    sound.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto text-white">
      <div className="space-y-4 pt-1">
        {/* Simpliers Brand Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-[#f43f5e] lowercase">simpliers</span>{' '}
            <span className="text-white">Giveaway</span>
          </h2>
          <p className="text-xs text-white/70 font-medium">
            The <span className="text-rose-500 font-bold">#1</span> Instagram Giveaway Picker
          </p>
        </div>

        {/* Post Card Thumbnail & Details */}
        <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-md">
          <div className="flex items-center space-x-2.5">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
            />
            <div>
              <div className="text-xs font-semibold text-white/90">
                {post.authorUsername}
              </div>
              <div className="text-[10px] text-white/50">{post.authorName}</div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-black/40 border border-white/5 relative">
            <img
              src={post.postImage}
              alt="Contest vehicle and author"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-white/90 font-sans leading-relaxed">
            {post.caption}
          </p>

          <div className="flex items-center space-x-4 text-xs text-white/70 pt-1">
            <span className="flex items-center space-x-1 text-rose-500 font-medium">
              <span>💬</span>
              <span>{post.commentsCount}</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-500 font-medium">
              <span>🤍</span>
              <span>{post.likesCount}</span>
            </span>
          </div>
        </div>

        {/* Shuffling Status or Result Info */}
        {isShuffling ? (
          <div className="bg-[#18181c] border border-white/10 rounded-2xl p-4 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-[#f43f5e] animate-spin mx-auto" />
            <h3 className="text-sm font-semibold text-white">Entries Are Shuffling...</h3>
            <p className="text-xs text-white/50">It should take less than a minute.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Giveaway Subtitle & Code Card */}
            <div className="bg-[#18181c] border border-white/10 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white/90">
                <img
                  src={post.authorAvatar}
                  alt={post.title}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{post.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Result Code */}
                <div className="space-y-1">
                  <span className="text-[11px] text-white/60 font-medium">Result Code</span>
                  <div className="flex items-center justify-between bg-[#121215] border border-white/10 rounded-xl px-3 py-2">
                    <span className="text-sm font-bold text-rose-500 tracking-wider">
                      {post.resultCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-white/60 hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Result Link */}
                <div className="space-y-1">
                  <span className="text-[11px] text-white/60 font-medium">Result Link</span>
                  <div className="flex items-center justify-between bg-[#121215] border border-white/10 rounded-xl px-3 py-2">
                    <span className="text-[11px] font-mono text-white/80 truncate mr-1">
                      {post.resultLink}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="text-white/60 hover:text-white transition-colors shrink-0"
                      title="Copy Link"
                    >
                      {copiedLink ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Are Safe Badge */}
            <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white">Results Are Safe</h4>
                <p className="text-[10px] text-white/60 leading-tight">
                  All comments of the giveaway were retrieved and audited transparently.
                </p>
              </div>
            </div>

            {/* Countdown Timer Config */}
            <div className="bg-[#18181c] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-xs font-medium text-white/80">Countdown Timer</span>
              </div>
              <div className="flex items-center space-x-2">
                {[5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      onSetCountdownSeconds(sec);
                      sound.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      countdownSeconds === sec
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 pb-2 grid grid-cols-2 gap-3 border-t border-white/5">
        <button
          onClick={() => {
            sound.playClick();
            onSeeEntries();
          }}
          className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-[#202026] text-white/90 hover:bg-[#282830] active:scale-98 transition-all font-semibold text-xs border border-white/5"
        >
          <Users className="w-4 h-4" />
          <span>See Entries</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onStartContest();
          }}
          className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-[#e60039] hover:bg-[#d00034] active:scale-98 transition-all text-white font-bold text-xs shadow-lg shadow-rose-600/30"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Contest</span>
        </button>
      </div>
    </div>
  );
};
