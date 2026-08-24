import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileOnly?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileOnly = true }) => {
  if (!isMobileOnly) {
    return <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans">
      {/* Phone container styled like modern iPhone */}
      <div className="relative w-full max-w-[420px] h-screen sm:h-[880px] bg-[#121214] text-white sm:rounded-[48px] sm:ring-12 sm:ring-[#222228] shadow-2xl flex flex-col overflow-hidden border border-[#2a2a32]">
        {/* iOS Status Bar */}
        <div className="relative z-40 px-7 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-white select-none bg-[#121214]">
          <span>10:53</span>
          
          {/* Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a1a36]/60 border border-blue-900/40 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-white">
            <span className="text-[10px] tracking-tighter">LTE</span>
            <div className="flex items-center text-[10px] font-bold">100</div>
            <div className="relative flex items-center">
              <Battery className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#121214]">
          {children}
        </div>

        {/* iOS Home Indicator */}
        <div className="w-full pb-2 pt-1 flex justify-center bg-[#121214] z-40">
          <div className="w-32 h-1 bg-white/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
