import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRate = (starCount: number) => {
    setRating(starCount);
    setSubmitted(true);
    try {
      sound.playClick();
    } catch {
      // Audio optional
    }
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
    }, 1200);
  };

  const handleDismiss = () => {
    try {
      sound.playClick();
    } catch {
      // Audio optional
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-[270px] bg-[#232326]/95 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-4 flex flex-col items-center text-center text-white"
          >
            {/* App Icon */}
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center p-1.5 mb-2.5">
              <span className="text-[#e60039] font-black text-xs tracking-tight select-none">
                simpliers
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="font-bold text-[14px] leading-tight text-white px-1">
              Enjoying simpliers Giveaway?
            </h3>
            <p className="text-[11px] text-white/70 mt-1 px-2 leading-snug">
              {submitted ? 'Thank you for your rating!' : 'Tap a star to rate it on the App Store.'}
            </p>

            {/* Star Rating Section */}
            <div className="w-full border-t border-white/10 mt-3 pt-3 pb-1 flex items-center justify-center space-x-2.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    className="p-0.5 hover:scale-110 active:scale-95 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isFilled
                          ? 'fill-[#007aff] text-[#007aff]'
                          : 'text-[#007aff] stroke-[1.75]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Bottom Button */}
            <div className="w-full border-t border-white/10 mt-2.5 pt-2.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-center text-[13px] font-medium text-[#007aff] hover:text-[#3894ff] active:opacity-70 transition-opacity focus:outline-none py-0.5"
              >
                {submitted ? 'Done' : 'Not Now'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
