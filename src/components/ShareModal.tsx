import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, QrCode, Instagram } from 'lucide-react';
import { ContestPost } from '../types';
import { sound } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ContestPost;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${post.resultLink}`);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#18181c] border border-white/15 rounded-3xl w-full max-w-[380px] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Share Giveaway Results</h3>
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

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Certificate Summary Card */}
          <div className="bg-gradient-to-br from-[#201018] to-[#121215] border border-rose-500/30 rounded-2xl p-3.5 space-y-2 text-center">
            <div className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">
              Verified Certificate
            </div>
            <div className="text-sm font-bold text-white">{post.title}</div>
            <div className="text-[11px] text-white/60">
              Audited by <span className="text-rose-400 font-semibold">simpliers</span>
            </div>
            <div className="pt-2 flex items-center justify-center space-x-2">
              <span className="text-xs text-white/40">Result Code:</span>
              <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                {post.resultCode}
              </span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-white/60 font-medium">Public Result Link</span>
            <div className="flex items-center justify-between bg-[#121215] border border-white/10 rounded-xl p-2.5">
              <span className="font-mono text-xs text-white/90 truncate mr-2">
                https://{post.resultLink}
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center space-x-1 shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Share Options */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                handleCopy();
              }}
              className="p-2.5 rounded-xl bg-[#121215] border border-white/10 hover:border-white/20 flex items-center justify-center space-x-2 text-white font-medium"
            >
              <Instagram className="w-4 h-4 text-rose-400" />
              <span>Instagram Story</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                handleCopy();
              }}
              className="p-2.5 rounded-xl bg-[#121215] border border-white/10 hover:border-white/20 flex items-center justify-center space-x-2 text-white font-medium"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#141418]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-[#252530] hover:bg-[#2e2e3a] rounded-xl text-xs font-bold text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
