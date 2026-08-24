import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationToastProps {
  show: boolean;
  onDismiss?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ show, onDismiss }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          onClick={onDismiss}
          className="absolute top-2 left-3 right-3 z-50 bg-[#1c1c22]/95 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 shadow-2xl flex items-start space-x-3 cursor-pointer select-none"
        >
          {/* App Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#e60039] flex items-center justify-center font-bold text-[9px] text-white tracking-tighter shrink-0 shadow-md">
            simpliers
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Getting Entries Completed!</span>
              <span className="text-[10px] text-white/50">now</span>
            </div>
            <p className="text-[11px] text-white/80 leading-tight mt-0.5">
              All entries are received. You can result your giveaway now.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
