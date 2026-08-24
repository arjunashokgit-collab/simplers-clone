import React from 'react';
import { ChevronLeft, Volume2, VolumeX, Moon } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, showBack = true }) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  return (
    <header className="bg-[#e60039] text-white px-4 py-2.5 flex items-center justify-between shadow-sm z-30 select-none">
      <div className="w-8 flex items-center">
        {showBack && onBack ? (
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-1 -ml-1.5 text-white/95 hover:text-white active:scale-95 transition-transform"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      <div className="flex-1 text-center">
        {title === 'simpliers' ? (
          <span className="text-xl font-bold tracking-tight text-white font-sans lowercase">
            simpliers
          </span>
        ) : (
          <h1 className="text-lg font-bold tracking-normal text-white">
            {title}
          </h1>
        )}
      </div>

      <div className="w-8 flex items-center justify-end space-x-1">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-1 text-white/80 hover:text-white transition-opacity"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </header>
  );
};
