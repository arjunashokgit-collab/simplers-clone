import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileOnly?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileOnly = true }) => {
  if (!isMobileOnly) {
    return <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Mobile website container */}
      <div className="relative w-full max-w-[420px] h-screen sm:h-[840px] bg-[#121214] text-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-[#2a2a32]">
        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#121214]">
          {children}
        </div>
      </div>
    </div>
  );
};
