import React from 'react';
import { Search, LayoutList, Home, Gift, User } from 'lucide-react';
import { sound } from '../utils/audio';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  const tabs = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'entries', icon: LayoutList, label: 'Entries' },
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'dashboard', icon: Gift, label: 'Dashboard & Media' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-[#e60039] text-white/80 px-4 py-2 flex items-center justify-around z-30 select-none border-t border-rose-700/30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              if (onTabChange) onTabChange(tab.id);
            }}
            className={`p-2 flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'text-[#121214] scale-110'
                : 'text-white/85 hover:text-white'
            }`}
            aria-label={tab.label}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? 'stroke-[2.8] fill-[#121214]' : 'stroke-[2]'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
